import os
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from transformers import BertTokenizer, BertModel
from sentence_transformers import SentenceTransformer
import torch
from rake_nltk import Rake
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import uuid
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore

# Firebase Admin SDK setup
cred = credentials.Certificate("firebase-service.json")  # Replace with your Firebase service account key file
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load BERT model and tokenizer for text embedding
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# Load Sentence-BERT model for context analysis
sbert_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Initialize RAKE for keyword extraction
rake = Rake()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Answer(BaseModel):
    player: str
    answer: str

class QuestionResponse(BaseModel):
    question: str
    timer: int

class ScoreResponse(BaseModel):
    player: str
    score: float

class JudgementResponse(BaseModel):
    question: str
    answers: List[ScoreResponse]
    winner: str

# Load the dataset
def load_dataset(base_path):
    data = []
    for category in os.listdir(base_path):
        category_path = os.path.join(base_path, category)
        if os.path.isdir(category_path):
            for filename in os.listdir(category_path):
                if filename.endswith('.txt'):
                    file_path = os.path.join(category_path, filename)
                    with open(file_path, 'r') as file:
                        content = file.read().strip()
                        if content:
                            data.append({
                                'category': category,
                                'question': filename.replace('.txt', ''),
                                'text': content,
                                'context': content
                            })
    df = pd.DataFrame(data)
    df['text_embedding'] = df['text'].apply(encode_text)
    df['context_embedding'] = df['context'].apply(encode_context)
    return df

def encode_text(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy().tolist()  # Convert to list

def encode_context(text):
    return sbert_model.encode(text).tolist()  # Convert to list

def extract_keywords(text):
    rake.extract_keywords_from_text(text)
    keywords = rake.get_ranked_phrases()
    return " ".join(keywords)

def get_best_score(user_input, category_df):
    # Extract context from user input
    user_context = extract_keywords(user_input)

    # Encode user input
    user_text_embedding = encode_text(user_input)
    user_context_embedding = encode_context(user_context)

    # Calculate similarity scores for text
    category_df = category_df.copy()  # Avoiding SettingWithCopyWarning
    category_df.loc[:, 'text_similarity'] = category_df['text_embedding'].apply(lambda x: cosine_similarity([x], [user_text_embedding]).item())

    # Calculate similarity scores for context
    category_df.loc[:, 'context_similarity'] = category_df['context_embedding'].apply(lambda x: cosine_similarity([x], [user_context_embedding]).item())

    # Combine scores
    category_df.loc[:, 'final_score'] = (category_df['text_similarity'] + category_df['context_similarity']) / 2

    # Get the best match
    best_match = category_df.loc[category_df['final_score'].idxmax()]

    return best_match['text'], best_match['final_score']

# Initialize the dataset
base_path = 'Dataset'  # Replace with your actual dataset path
df = load_dataset(base_path)

@app.post("/start_game")
def start_game():
    session_id = str(uuid.uuid4())
    questions = df.sample(frac=1).to_dict(orient="records")
    db.collection("games").document(session_id).set({
        "questions": [{ "question": q["question"], "category": q["category"] } for q in questions],  # Only save necessary info
        "current_question_index": 0,
        "scores": {},
        "is_playing": True,
        "timer": 5
    })
    return {"session_id": session_id}

@app.get("/get_question/{session_id}", response_model=QuestionResponse)
def get_question(session_id: str):
    game_doc = db.collection("games").document(session_id).get()
    if not game_doc.exists:
        raise HTTPException(status_code=404, detail="Session not found")

    game_data = game_doc.to_dict()
    current_question_index = game_data["current_question_index"]
    questions = game_data["questions"]

    if current_question_index >= len(questions):
        raise HTTPException(status_code=404, detail="No more questions available")

    question = questions[current_question_index]["question"]
    return QuestionResponse(question=question, timer=5)

@app.post("/submit_answers/{session_id}", response_model=JudgementResponse)
def submit_answers(session_id: str, answers: List[Answer]):
    game_doc = db.collection("games").document(session_id).get()
    if not game_doc.exists:
        raise HTTPException(status_code=404, detail="Session not found")

    game_data = game_doc.to_dict()
    current_question_index = game_data["current_question_index"]
    questions = game_data["questions"]

    if current_question_index == -1:
        raise HTTPException(status_code=400, detail="No question has been fetched yet")

    current_question = questions[current_question_index]
    
    # Use local dataset for scoring
    category_df = df[df['category'] == current_question['category']].copy()

    scores = []
    for answer in answers:
        best_text, best_score = get_best_score(answer.answer, category_df)
        scores.append(ScoreResponse(player=answer.player, score=best_score))
        game_data["scores"][answer.player] = game_data["scores"].get(answer.player, 0) + best_score

    winner = max(scores, key=lambda x: x.score).player

    # Update the game session in Firestore
    db.collection("games").document(session_id).update({
        "current_question_index": current_question_index + 1,
        "scores": game_data["scores"]
    })

    return JudgementResponse(
        question=current_question["question"],
        answers=scores,
        winner=winner
    )

@app.post("/end_game/{session_id}")
def end_game(session_id: str):
    game_doc = db.collection("games").document(session_id).get()
    if not game_doc.exists:
        raise HTTPException(status_code=404, detail="Session not found")

    game_data = game_doc.to_dict()
    final_scores = [{"player": player, "score": score} for player, score in game_data["scores"].items()]
    winner = max(final_scores, key=lambda x: x["score"])["player"]

    # Delete the game session from Firestore
    db.collection("games").document(session_id).delete()

    return {"final_scores": final_scores, "winner": winner}

# To run the API, use the command: uvicorn script_name:app --reload
# Replace 'script_name' with the name of your script file

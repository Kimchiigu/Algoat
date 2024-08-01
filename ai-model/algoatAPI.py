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
import random
import uuid

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://127.168.1.8:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load BERT model and tokenizer for text embedding
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# Load Sentence-BERT model for context analysis
sbert_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Initialize RAKE for keyword extraction
rake = Rake()

class Answer(BaseModel):
    player: str
    answer: str

class QuestionResponse(BaseModel):
    question: str

class ScoreResponse(BaseModel):
    player: str
    score: float

class JudgementResponse(BaseModel):
    question: str
    answers: List[ScoreResponse]
    winner: str

class GameSession:
    def __init__(self, questions: pd.DataFrame):
        self.questions = questions.sample(frac=1).reset_index(drop=True)
        self.current_question_index = -1
        self.scores = {}
    
    def get_next_question(self):
        self.current_question_index += 1
        if self.current_question_index >= len(self.questions):
            raise IndexError("No more questions available")
        return self.questions.iloc[self.current_question_index]

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
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

def encode_context(text):
    return sbert_model.encode(text)

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

# Dictionary to hold game sessions
game_sessions: Dict[str, GameSession] = {}

@app.post("/start_game")
def start_game():
    session_id = str(uuid.uuid4())
    game_sessions[session_id] = GameSession(df)
    return {"session_id": session_id}

@app.get("/get_question/{session_id}", response_model=QuestionResponse)
def get_question(session_id: str):
    if session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    game_session = game_sessions[session_id]
    
    try:
        question = game_session.get_next_question()
    except IndexError:
        raise HTTPException(status_code=404, detail="No more questions available")
    
    return QuestionResponse(question=question['question'])

@app.post("/submit_answers/{session_id}", response_model=JudgementResponse)
def submit_answers(session_id: str, answers: List[Answer]):
    if session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    game_session = game_sessions[session_id]
    
    if game_session.current_question_index == -1:
        raise HTTPException(status_code=400, detail="No question has been fetched yet")

    current_question = game_session.questions.iloc[game_session.current_question_index]
    category_df = df[df['category'] == current_question['category']].copy()

    scores = []
    for answer in answers:
        best_text, best_score = get_best_score(answer.answer, category_df)
        scores.append(ScoreResponse(player=answer.player, score=best_score))
        game_session.scores[answer.player] = game_session.scores.get(answer.player, 0) + best_score

    winner = max(scores, key=lambda x: x.score).player
    
    return JudgementResponse(
        question=current_question['question'],
        answers=scores,
        winner=winner
    )

@app.post("/end_game/{session_id}")
def end_game(session_id: str):
    if session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    game_session = game_sessions.pop(session_id)
    
    final_scores = [{"player": player, "score": score} for player, score in game_session.scores.items()]
    winner = max(final_scores, key=lambda x: x["score"])["player"]
    
    return {"final_scores": final_scores, "winner": winner}

# To run the API, use the command: uvicorn script_name:app --reload
# Replace 'script_name' with the name of your script file

import os
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from transformers import BertTokenizer, BertModel
from sentence_transformers import SentenceTransformer
import torch
from rake_nltk import Rake
import random

# Load BERT model and tokenizer for text embedding
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# Load Sentence-BERT model for context analysis
sbert_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Initialize RAKE for keyword extraction
rake = Rake()

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

def getBestScore(user_input, category_df):
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

def play_game(df):
    categories = df['category'].unique()
    print("Categories:")
    for idx, category in enumerate(categories, 1):
        print(f"{idx}. {category}")
    
    category_choice = int(input("Choose a category by number: ")) - 1
    selected_category = categories[category_choice]
    category_df = df[df['category'] == selected_category].copy()

    random_question = category_df.sample(n=1).iloc[0]

    print(f"Question: {random_question['question']}")

    players = ["Player 1", "Player 2"]
    scores = {}
    answers = {}

    for player in players:
        user_input = input(f"{player}, enter your answer: ")
        best_text, best_score = getBestScore(user_input, category_df)
        scores[player] = best_score
        answers[player] = user_input

    print("\nAlgoat the Goat is judging...\n")
    
    for player in players:
        print(f"{player} with '{answers[player]}' gets a score of {scores[player]}")

    winner = max(scores, key=scores.get)
    print(f"\nThe winner for this round is {winner} with a score of {scores[winner]}")

# Load the dataset
base_path = 'path/to/your/dataset'  # Replace with your actual dataset path
df = load_dataset(base_path)

# Start the game
play_game(df)

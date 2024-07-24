import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pandas as pd
import random

# Load the model
model = load_model('it_problem_solver_model.h5')

# Load the dataset for tokenization
df = pd.read_csv('it_problems.csv')
tokenizer = Tokenizer(num_words=10000)
tokenizer.fit_on_texts(df['problem_description'])

def evaluate_with_ai(answer1, answer2, question):
    # Tokenize and pad the question for the model
    sequences = tokenizer.texts_to_sequences([question])
    padded_question = pad_sequences(sequences, maxlen=200)

    # Tokenize and pad the answers for the model
    sequences1 = tokenizer.texts_to_sequences([answer1])
    padded_answer1 = pad_sequences(sequences1, maxlen=200)
    sequences2 = tokenizer.texts_to_sequences([answer2])
    padded_answer2 = pad_sequences(sequences2, maxlen=200)

    # Predict the relevance of the answers
    prediction1 = model.predict(padded_answer1)[0]
    prediction2 = model.predict(padded_answer2)[0]

    # Compare the predictions (simplified for demonstration)
    score1 = max(prediction1)
    score2 = max(prediction2)

    if score1 > score2:
        return "Player 1 wins!"
    elif score2 > score1:
        return "Player 2 wins!"
    else:
        return "It's a tie!"

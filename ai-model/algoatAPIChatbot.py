from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline, BertTokenizerFast, AlbertForQuestionAnswering
from fastapi.middleware.cors import CORSMiddleware

# Load the fine-tuned model and tokenizer
tokenizer = BertTokenizerFast.from_pretrained('Wikidepia/indobert-lite-squad')
model = AlbertForQuestionAnswering.from_pretrained('Wikidepia/indobert-lite-squad')

# Create the QA pipeline
qa_pipeline = pipeline(
    "question-answering",
    model=model,
    tokenizer=tokenizer
)

# Initialize FastAPI app
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

# Define the request body
class QuestionRequest(BaseModel):
    question: str
    context: str

# Define the route for the QA model
@app.post("/answer/")
async def get_answer(question_request: QuestionRequest):
    result = qa_pipeline({
        'context': question_request.context,
        'question': question_request.question
    })
    return {"answer": result['answer']}

# To run the server, use the command: uvicorn algoatAPIChatbot:app --reload

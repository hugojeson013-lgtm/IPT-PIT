import requests

url = "http://127.0.0.1:8000/api/questions/"
headers = {
    "Authorization": "Token 3004d4981e13bc541940986684724a73752c0f20", # I need the actual token... wait.
    "Content-Type": "application/json"
}

data = {
    "text": "To create a virtual environment in Python...",
    "question_type": "ESSAY",
    "required_keywords": "venv",
    "options": [
        {"text": "", "is_correct": False},
        {"text": "", "is_correct": False},
        {"text": "", "is_correct": False},
        {"text": "", "is_correct": False}
    ],
    "exam": 1
}

# I'll just check the serializer validation in a shell script instead of a real request if I don't have the token handy.
# Or I can get the token from the DB.

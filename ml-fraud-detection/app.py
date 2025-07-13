# ml-fraud-detection/app.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pymongo import MongoClient
import ollama
import os
from datetime import datetime

# Load .env variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")  # Optional, not used here yet

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["godseye"]
hazard_collection = db["hazard_logs"]

app = FastAPI()

# CORS setup so frontend (e.g., React) can call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core hazard detection logic
def detect_hazard_message(message: str) -> str:
    prompt = f'''
You are a data protection assistant integrated into a corporate chat system. Your job is to detect whether a message contains confidential, private, or hazardous information that should not be shared between employees in open communication.

Your output must be only:
- "SAFE" — if the message is not confidential.
- "CONFIDENTIAL" — if the message contains any confidential or sensitive information.

Confidential messages may include:
- Internal passwords, API keys, database URIs.
- Mentions of projects or code names not yet public.
- Information about company finances, employee data, client lists.
- File names or documents marked confidential or private.
- Anything violating NDAs or internal data policies.

Examples: "password", "API key", "internal tool", "client details", "HR file", etc.

Do not explain. Just return one word: "CONFIDENTIAL" or "SAFE".

Now evaluate this message:
\"\"\"{message}\"\"\"
    '''
    try:
        response = ollama.chat(model='mistral', messages=[
            {"role": "user", "content": prompt}
        ])
        result = response['message']['content'].strip()
        return result
    except Exception as e:
        print("Error talking to Mistral:", e)
        return "ERROR"

# API route that receives chat message and returns hazard tag
@app.post("/check-hazard")
async def check_hazard(request: Request):
    data = await request.json()
    message = data.get("message", "")
    sender = data.get("sender", "Unknown")

    result = detect_hazard_message(message)

    # Log only if it's confidential
    if result == "CONFIDENTIAL":
        hazard_collection.insert_one({
            "sender": sender,
            "message": message,
            "tag": result,
            "timestamp": datetime.utcnow()
        })

    return {"result": result}

# New endpoint for real-time hazard detection while typing
@app.post("/detect")
async def detect_hazard_realtime(request: Request):
    data = await request.json()
    message = data.get("message", "")
    
    if not message.strip():
        return {"result": "SAFE"}
    
    result = detect_hazard_message(message)
    return {"result": result}

# ml-fraud-detection/hazard_detector.py
import ollama

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
"""
{message}
"""
    '''

    response = ollama.chat(model='mistral', messages=[
        {"role": "user", "content": prompt}
    ])

    return response['message']['content'].strip()

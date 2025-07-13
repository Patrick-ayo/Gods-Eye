import ollama

def detect_hazard_message(message: str) -> str:
    prompt = f'''
You are a strict corporate data protection assistant integrated into a company chat system. Your role is to rigorously evaluate messages for any trace of confidential, sensitive, internal, or hazardous content. You must prioritize data protection over message flow.

You MUST return only one of the following outputs:
- "CONFIDENTIAL" — if the message contains ANY content that might be confidential or sensitive in a corporate environment.
- "SAFE" — only if the message is clearly free from all forms of sensitive or internal information.

Treat any of the following as confidential:
- API keys, access tokens, passwords, secrets.
- Internal URLs, server addresses, database URIs (e.g., MongoDB, PostgreSQL, AWS links).
- File paths, filenames, or folders indicating internal use or marked private/confidential.
- Mentions of unreleased products, internal code names, prototypes, or research.
- Any employee information (IDs, names in context, roles, salaries, performance).
- Discussions involving clients, contracts, vendors, invoices, or pricing.
- Any message that references NDAs, confidential meetings, reports, audits, or legal documents.
- Phrases such as: "use this key", "internal only", "private repo", "confidential report", "do not share", "client data", "production DB", etc.
- Any suspicious or borderline-sensitive content — when unsure, default to "CONFIDENTIAL".

Absolutely no explanation. Only respond with:
"CONFIDENTIAL" or "SAFE"

Now classify the following message:
"""
{message}
"""
    '''

    try:
        response = ollama.chat(model='mistral', messages=[{"role": "user", "content": prompt}])
        output = response.get('message', {}).get('content', '').strip().upper()
        return output if output in {"SAFE", "CONFIDENTIAL"} else "UNDEFINED"
    except Exception as e:
        print(f"Error during hazard detection: {e}")
        return "ERROR"

import requests

GROQ_API_KEY = ""

def get_groq_response(user_input):
    url = "https://api.groq.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    data = {
    "model": "llama3-8b-8192",  # Use an available model
    "messages": [{"role": "user", "content": user_text}]
}

    response = requests.post(url, headers=headers, json=data)
    return response.json()["choices"][0]["message"]["content"]

# Test AI Response


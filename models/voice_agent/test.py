import requests
import json

API_KEY = ""  # Replace with your actual API key
URL = "https://api.groq.com/openai/v1/chat/completions"

def get_groq_response(user_text):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "mistral-saba-24b",  # Updated model name
        "messages": [{"role": "user", "content": user_text}]
    }

    response = requests.post(URL, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        print("Error:", response.json())
        return f"Error: {response.json()}"

# Test the function

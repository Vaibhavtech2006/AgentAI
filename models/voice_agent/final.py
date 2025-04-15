from main import recognize_speech
from test import get_groq_response
from call import speak
from tw import make_call

def ai_call():
    print("AI Calling Bot Started...")
    while True:
        user_input = recognize_speech()  # Listen
        print(f"User input: {user_input}")  # Debugging

        if not user_input:
            print("No input detected. Retrying...")
            continue

        if "exit" in user_input.lower():
            print("Call ended.")
            break
        
        response = get_groq_response(user_input)  # AI Response
        print(f"AI Response: {response}")  # Debugging
        
        if not response:
            print("No response from AI. Retrying...")
            continue

        speak(response)  # AI Speaks
        print("AI spoke successfully.")
        
          # AI Calls the User
        print("Call function executed.")

ai_call()

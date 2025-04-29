from google import generativeai as genai
from phi.agent import Agent
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from dotenv import load_dotenv
import pyttsx3
import pyaudio
import vosk
import json
import os
import time

# Load environment variables
load_dotenv()

# Configure Gemini with API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))  # Store your Gemini API key in .env as GOOGLE_API_KEY

# Initialize Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

# Voice output setup
engine = pyttsx3.init()
def speak(text):
    print(f"Agent: {text}")
    engine.say(text)
    engine.runAndWait()

# Vosk model setup
MODEL_PATH = "vosk-model-small-en-us-0.15"
model_vosk = vosk.Model(MODEL_PATH)

def listen_with_vosk(timeout=10):
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000)
    recognizer = vosk.KaldiRecognizer(model_vosk, 16000)
    
    print("Listening...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        data = stream.read(4000, exception_on_overflow=False)
        if recognizer.AcceptWaveform(data):
            result = json.loads(recognizer.Result())
            user_input = result.get("text", "")
            if user_input:
                print(f"You: {user_input}")
                return user_input
    return ""  # If nothing heard within timeout

# Business context
business_name = "Jai Ambey Enterprise"
product_description = "JK Lakshmi Cement - high-quality cement for construction."
sales_pitch = "JK Lakshmi Cement ensures strong, durable structures. It’s reliable and cost-effective."

# Generate Gemini response
def generate_gemini_response(user_input):
    try:
        response = model.generate_content(user_input)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "Sorry, I couldn't process that right now."

# Voice Chat Agent
class VoiceChatAgent(Agent):
    def __init__(self):
        super().__init__(
            name="SalesCallAgent",
            role=f"""You are an AI sales agent from '{business_name}' promoting: '{product_description}'.
Try to convert the listener into a customer. Use this pitch: '{sales_pitch}'.""",
            model=Groq(id="gemma2-9b-it"),
            storage=SqlAgentStorage(table_name="sales_call_agent", db_file="sales_agent.db"),
            add_history_to_messages=True
        )

    def start_voice_chat(self):
        speak(f"Hello! I'm calling from {business_name}. I’d love to talk about {product_description}.")
        
        while True:
            speak("Are you currently planning any construction projects?")
            user_input = listen_with_vosk().lower()

            if user_input in ['exit', 'quit', 'bye']:
                speak("Thank you for your time. Have a great day!")
                break

            response = generate_gemini_response(user_input)
            self.handle_response(response)

    def handle_response(self, text):
        speak("Let me explain a bit.")
        self.speak_in_parts(text)
        speak("Would you like more details or shall I tell you about something else?")
        user_input = listen_with_vosk().lower()
        if "yes" in user_input:
            self.speak_in_parts(sales_pitch)
        elif "no" in user_input:
            speak("Alright. Let me know if you need anything else.")
        else:
            speak("I didn’t quite catch that. Can you repeat?")

    def speak_in_parts(self, text):
        parts = text.split(".")
        for part in parts:
            if part.strip():
                speak(part.strip())
                time.sleep(1)

# Run agent
if __name__ == "__main__":
    agent = VoiceChatAgent()
    agent.start_voice_chat()

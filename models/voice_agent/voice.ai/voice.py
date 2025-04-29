from phi.agent import Agent
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from dotenv import load_dotenv
import pyttsx3
import pyaudio
import vosk
import json
import os

load_dotenv()
# Setup for voice output
engine = pyttsx3.init()

def speak(text):
    print(f"Agent: {text}")
    engine.say(text)
    engine.runAndWait()

# Setup Vosk model
MODEL_PATH = "vosk-model-small-en-us-0.15"
model = vosk.Model(MODEL_PATH)

def listen_with_vosk():
    p = pyaudio.PyAudio()

    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000)
    recognizer = vosk.KaldiRecognizer(model, 16000)

    print("Listening...")
    while True:
        data = stream.read(4000, exception_on_overflow=False)
        if recognizer.AcceptWaveform(data):
            result = json.loads(recognizer.Result())
            user_input = result["text"]
            if user_input:
                print(f"You: {user_input}")
                return user_input

class VoiceChatAgent(Agent):
    def __init__(self):
        super().__init__(
            name="VoiceAgent",
            role="A friendly assistant that talks with you through voice.",
            model=Groq(id="mistral-saba-24b"),
            storage=SqlAgentStorage(table_name="voice_chat_agent", db_file="voice_agent.db"),
            add_history_to_messages=True
        )

    def start_voice_chat(self):
        speak("Hi there! I'm your AI assistant. Let's chat.")
        while True:
            user_input = listen_with_vosk()
            if user_input.lower() in ['exit', 'quit', 'bye']:
                speak("Goodbye! Talk to you soon.")
                break
            response = self.run(user_input)
            speak(response.messages[-1].content)

if __name__ == "__main__":
    agent = VoiceChatAgent()
    agent.start_voice_chat()

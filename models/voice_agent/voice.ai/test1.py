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
import threading

# Load environment variables
load_dotenv()

# Setup for voice output
engine = pyttsx3.init()

def speak(text):
    print(f"Agent: {text}")
    engine.say(text)
    engine.runAndWait()

# Setup Vosk model
MODEL_PATH = "vosk-model-small-en-us-0.15"  # Ensure this folder is downloaded and exists
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

# Business details
business_name = "Jai Ambey Enterprise"
product_description = "JK Lakshmi Cement - high-quality cement for construction, offering durability, strength, and cost-effectiveness."
sales_pitch = "JK Lakshmi Cement is your perfect choice for building strong, durable, and long-lasting structures. Whether you're constructing a home or an industrial building, our cement ensures superior quality and reliability, at a competitive price. Choose JK Lakshmi Cement for a solid foundation and a lasting investment."

# Custom responses for common questions
responses = {
    "what is jk lakshmi cement": f"JK Lakshmi Cement is a high-quality cement product known for its durability, strength, and cost-effectiveness. It is ideal for all types of construction.",
    "why choose jk lakshmi cement": f"JK Lakshmi Cement offers superior quality, strength, and reliability. It provides long-lasting results at a competitive price, ensuring your construction stands the test of time.",
    "how is jk lakshmi cement different": f"Unlike other brands, JK Lakshmi Cement has been trusted for years in the industry for its consistent quality. It is formulated to give maximum strength with minimal wastage.",
    "what are the benefits of jk lakshmi cement": f"JK Lakshmi Cement provides excellent bonding and strength for your structures. It reduces the chances of cracks, ensuring durability. It also reduces overall costs for construction, making it a preferred choice."
}

class VoiceChatAgent(Agent):
    def __init__(self):
        super().__init__(
            name="SalesCallAgent",
            role=f"""You are a professional AI sales call agent representing the company '{business_name}'.
Your job is to promote the product or service: '{product_description}' in a friendly, convincing tone.
Always guide the conversation toward the benefits of the offering and try to convert the listener into a customer.
You can use the following pitch when needed: '{sales_pitch}'.
Keep the conversation polite, persuasive, and adaptive based on the user's responses.""",
            model=Groq(id="mistral-saba-24b"),
            storage=SqlAgentStorage(table_name="sales_call_agent", db_file="sales_agent.db"),
            add_history_to_messages=True
        )

    def start_voice_chat(self):
        speak(f"Hello! I'm calling on behalf of {business_name}. I’d love to share something about {product_description}.")
        while True:
            user_input = listen_with_vosk().lower()

            # Exit condition
            if user_input in ['exit', 'quit', 'bye']:
                speak("Thank you for your time. Have a great day!")
                break

            # Check if the user asks for information about the product
            if user_input in responses:
                # Break the response into small parts
                self.speak_in_parts(responses[user_input])
            else:
                # If not a predefined question, use the agent model to respond
                response = self.run(user_input)
                self.speak_in_parts(response.messages[-1].content)

    def speak_in_parts(self, text):
        """Speak in smaller chunks and listen for interruptions."""
        parts = text.split(".")  # Split the text into smaller chunks by sentences
        for part in parts:
            if part.strip():
                speak(part.strip())  # Speak one part at a time
                time.sleep(1)  # Give a small delay to listen for interruptions
                # Check if user has started speaking during the agent's speech
                if self.check_for_interruption():
                    speak("I hear you're speaking, pausing now.")
                    break  # Stop and wait for the user to speak

    def check_for_interruption(self):
        """Detect if the user is speaking (interrupting the agent)."""
        user_input = listen_with_vosk().lower()
        if user_input:
            return True
        return False

if __name__ == "__main__":
    agent = VoiceChatAgent()
    agent.start_voice_chat()

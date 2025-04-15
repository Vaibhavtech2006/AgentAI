import pyttsx3

engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

# Test TTS
speak("Hello, this is an AI-powered calling bot.")

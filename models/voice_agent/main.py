import pyaudio
import vosk
import json

MODEL_PATH = "vosk-model-small-en-us-0.15"
model = vosk.Model(MODEL_PATH)

def recognize_speech():
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000)
    recognizer = vosk.KaldiRecognizer(model, 16000)

    print("Listening...")
    while True:
        data = stream.read(4000, exception_on_overflow=False)
        if recognizer.AcceptWaveform(data):
            result = json.loads(recognizer.Result())
            return result["text"]

print("Say something:")
user_text = recognize_speech()
print(f"You said: {user_text}")

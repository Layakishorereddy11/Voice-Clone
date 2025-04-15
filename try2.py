import os
import uuid
import librosa
import soundfile as sf
import sounddevice as sd
from TTS.api import TTS

# ========== Config ==========
SAMPLE_RATE = 22050
RECORD_SECONDS = 20
TEXT_TO_SPEAK = "My interests lie at the intersection of machine learning, distributed systems, and data engineering. I've designed deep learning models for encrypted data, built scalable real-time search platforms using dual-database architectures, and created AI agents like ChessGPT that blend NLP with strategic prediction."
BASE_DIR = 'try_samples'
RECORDING_PATH = os.path.join(BASE_DIR, f"recorded_{uuid.uuid4().hex}.wav")
OUTPUT_WAV = os.path.join(BASE_DIR, f"output_{uuid.uuid4().hex}.wav")
OUTPUT_MP3 = OUTPUT_WAV.replace(".wav", ".mp3")

#I'm a Data Science graduate student at Rutgers University with a strong foundation in software engineering 
# and a passion for building intelligent, scalable systems. Previously at Optum, 
# I developed microfrontend applications and backend services using Angular, Spring Boot, and 
# GCP, with a focus on user experience, security, and performance.
# ========== Step 1: Record from Mic ==========
print(f"🎙️ Recording {RECORD_SECONDS} seconds of audio...")
recording = sd.rec(int(RECORD_SECONDS * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype='float32')
sd.wait()
sf.write(RECORDING_PATH, recording, SAMPLE_RATE)
print(f"✅ Voice recorded and saved to {RECORDING_PATH}")

# ========== Step 2: Resample if necessary ==========
y, sr = librosa.load(RECORDING_PATH, sr=SAMPLE_RATE)
sf.write(RECORDING_PATH, y, sr)

# ========== Step 3: Initialize TTS ==========
tts = TTS(model_name="tts_models/multilingual/multi-dataset/your_tts", gpu=False)

# ========== Step 4: Synthesize Voice ==========
print("🧠 Synthesizing voice...")
tts.tts_to_file(text=TEXT_TO_SPEAK, language="en", speaker_wav=RECORDING_PATH, file_path=OUTPUT_WAV)
print(f"🔊 Synthesized WAV saved to {OUTPUT_WAV}")

# Optionally, convert to MP3 using pydub if needed:
# from pydub import AudioSegment
# audio = AudioSegment.from_wav(OUTPUT_WAV)
# audio.export(OUTPUT_MP3, format="mp3")
# print(f"🎧 Synthesized MP3 saved to {OUTPUT_MP3}")

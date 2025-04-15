import os
import uuid
import torch
import librosa
import soundfile as sf
import sounddevice as sd
from pydub import AudioSegment
from tortoise.api import TextToSpeech
from tortoise.utils.audio import load_audio

# ========== Config ==========
SAMPLE_RATE = 22050
RECORD_SECONDS = 10
TEXT_TO_CLONE = "This is a cloned voice speaking. Welcome to Tortoise TTS."
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECORDING_PATH = os.path.join(BASE_DIR, f"recorded_{uuid.uuid4().hex}.wav")
OUTPUT_WAV = os.path.join(BASE_DIR, f"output_{uuid.uuid4().hex}.wav")
OUTPUT_MP3 = OUTPUT_WAV.replace(".wav", ".mp3")

# ========== Step 1: Record from Mic ==========
print(f"🎙️ Recording {RECORD_SECONDS} seconds of audio...")
recording = sd.rec(int(RECORD_SECONDS * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype='float32')
sd.wait()
sf.write(RECORDING_PATH, recording, SAMPLE_RATE)
print(f"✅ Voice recorded and saved to {RECORDING_PATH}")

# ========== Step 2: Resample for Tortoise ==========
y, sr = librosa.load(RECORDING_PATH, sr=SAMPLE_RATE)
sf.write(RECORDING_PATH, y, sr)

# ========== Step 3: Initialize Tortoise ==========
device = "cuda" if torch.cuda.is_available() else "cpu"
tts = TextToSpeech(device=device)

# ========== Step 4: Clone Voice ==========
print("🧠 Synthesizing voice from your sample...")
reference_clip = load_audio(RECORDING_PATH, SAMPLE_RATE)

embedding = tts.get_voice_embedding(reference_clip)
generated_audio = tts.tts_with_preset(
    text=TEXT_TO_CLONE,
    voice_samples=None,
    speaker_embedding=embedding,
    preset="standard"
)


# generated_audio = tts.tts_with_preset(
#     text=TEXT_TO_CLONE,
#     voice_samples=[reference_clip],
#     preset="standard"
# )

# ========== Step 5: Save Output ==========
sf.write(OUTPUT_WAV, generated_audio.cpu().numpy(), 24000)
print(f"🔊 Synthesized WAV saved to {OUTPUT_WAV}")

# audio = AudioSegment.from_wav(OUTPUT_WAV)
# # audio.export(OUTPUT_MP3, format="mp3")
# # print(f"🎧 Synthesized MP3 saved to {OUTPUT_MP3}")

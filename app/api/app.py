import os
import uuid
import json
import numpy as np
import torch
import librosa
import soundfile as sf
import sounddevice as sd
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from TTS.api import TTS
from pydub import AudioSegment
from dotenv import load_dotenv
import io

load_dotenv()

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient(os.environ.get("MONGO_URI"))
db = client.voice_clone_db
voices_collection = db.voices

# Ensure voice data directory exists
VOICE_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'voices')
os.makedirs(VOICE_DATA_DIR, exist_ok=True)

try:
    # This forces a call to the server and will raise an exception if not connected.
    client.server_info()
    print("Connected successfully to MongoDB")
except Exception as e:
    print("MongoDB connection error:", e)
    
# Initialize YourTTS model
print("Loading YourTTS model...")
tts = TTS(model_name="tts_models/multilingual/multi-dataset/your_tts", gpu=torch.cuda.is_available())
print(f"YourTTS model loaded successfully. Using GPU: {torch.cuda.is_available()}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy"})

@app.route('/api/voices', methods=['GET'])
def get_voices():
    """Get all voice models."""
    voices = list(voices_collection.find())
    for voice in voices:
        voice['_id'] = str(voice['_id'])
    return jsonify(voices)

@app.route('/api/voices/<voice_id>', methods=['GET'])
def get_voice(voice_id):
    """Get a specific voice model."""
    voice = voices_collection.find_one({'_id': ObjectId(voice_id)})
    if not voice:
        return jsonify({"error": "Voice not found"}), 404
    voice['_id'] = str(voice['_id'])
    return jsonify(voice)

@app.route('/api/voices/upload', methods=['POST'])
def upload_voice():
    """Upload a voice sample for cloning."""
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    voice_name = request.form.get('name', f'Voice-{uuid.uuid4().hex[:8]}')
    file = request.files['audio']
    
    # Save uploaded file temporarily
    temp_path = os.path.join(VOICE_DATA_DIR, f"temp_{uuid.uuid4().hex}.wav")
    file.save(temp_path)
    
    try:
        # Convert to proper format if needed
        y, sr = librosa.load(temp_path, sr=22050)
        voice_id = uuid.uuid4().hex
        voice_path = os.path.join(VOICE_DATA_DIR, f"{voice_id}.wav")
        sf.write(voice_path, y, sr)
        
        # Save voice metadata to MongoDB
        voice_data = {
            "name": voice_name,
            "voice_id": voice_id,
            "path": voice_path,
            "created_at": str(datetime.now())
        }
        result = voices_collection.insert_one(voice_data)
        voice_data["_id"] = str(result.inserted_id)
        
        # Clean up temp file
        os.remove(temp_path)
        
        return jsonify(voice_data), 201
    
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

@app.route('/api/synthesize', methods=['POST'])
def synthesize_text():
    """Synthesize text using a cloned voice with YourTTS."""
    data = request.json
    
    if not data or 'text' not in data or 'voice_id' not in data:
        return jsonify({"error": "Missing text or voice_id"}), 400
    
    text = data['text']
    voice_id = data['voice_id']
    
    # Get voice from database
    voice = voices_collection.find_one({"voice_id": voice_id})
    if not voice:
        return jsonify({"error": "Voice not found"}), 404
    
    voice_path = voice['path']
    
    try:
        # Generate output file path
        output_id = uuid.uuid4().hex
        output_path = os.path.join(VOICE_DATA_DIR, f"output_{output_id}.wav")
        
        # Generate audio with YourTTS
        tts.tts_to_file(
            text=text,
            language="en",
            speaker_wav=voice_path,
            file_path=output_path
        )
        
        # Convert to MP3 for better streaming
        wav_audio = AudioSegment.from_wav(output_path)
        mp3_path = os.path.join(VOICE_DATA_DIR, f"output_{output_id}.mp3")
        wav_audio.export(mp3_path, format="mp3")
        
        # Clean up WAV file
        os.remove(output_path)
        
        # Return the audio file
        return send_file(mp3_path, mimetype="audio/mpeg", as_attachment=True)
    
    except Exception as e:
        print(f"Error in synthesis: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/audio/<filename>', methods=['GET'])
def get_audio(filename):
    """Stream an audio file."""
    file_path = os.path.join(VOICE_DATA_DIR, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    return send_file(file_path)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
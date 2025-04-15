# Voice-Clone

A web application for voice cloning and text-to-speech synthesis. Create your own voice clone and generate speech that sounds just like you!

## Features

- Record or upload voice samples to create personalized voice clones
- Generate natural-sounding speech from text using your cloned voice
- Modern, responsive UI for both desktop and mobile devices
- Storage of voice models for future use
- Easy download of generated audio files

## Technology Stack

- **Backend**: Flask, YourTTS (Coqui TTS) for voice cloning and text-to-speech
- **Frontend**: React with Material UI components
- **Database**: MongoDB for voice model storage
- **Audio Processing**: librosa, soundfile, pydub

## Requirements

- Python 3.8+
- Node.js 14+
- MongoDB

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd app/api
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Make sure MongoDB is running on your system or setup MongoDB Atlas.

4. Start the Flask server:
   ```
   python run.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd app/client
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment

This application can be deployed using Docker containers for scalability:

1. Build and deploy the backend as a Flask application
2. Build and deploy the React frontend
3. Set up MongoDB either as a container or using a managed service

## License

[MIT License](LICENSE)
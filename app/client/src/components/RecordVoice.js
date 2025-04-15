import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RecordRTC from 'recordrtc';
import axios from 'axios';

function RecordVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [voiceName, setVoiceName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const recorder = useRef(null);
  const microphone = useRef(null);
  const navigate = useNavigate();

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphone.current = stream;
      
      recorder.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        sampleRate: 44100,
        desiredSampRate: 22050,
      });
      
      recorder.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Error accessing microphone. Please ensure microphone permissions are enabled.');
    }
  };

  const stopRecording = () => {
    if (recorder.current) {
      recorder.current.stopRecording(() => {
        const blob = recorder.current.getBlob();
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        
        // Stop microphone access
        if (microphone.current) {
          microphone.current.getTracks().forEach(track => track.stop());
        }
      });
    }
  };

  const handleFileUpload = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const blob = new Blob([event.target.result], { type: file.type });
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadVoice = async () => {
    if (!audioBlob) {
      setError('Please record or upload a voice sample first');
      return;
    }
    
    if (!voiceName.trim()) {
      setError('Please enter a name for your voice');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice_sample.wav');
      formData.append('name', voiceName);
      
      const response = await axios.post('/api/voices/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      setIsUploading(false);
      navigate('/voices');
    } catch (err) {
      console.error('Error uploading voice:', err);
      setError('Error uploading voice. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1>Record Your Voice</h1>
      
      <div className="card">
        <h2>Voice Recording</h2>
        <p>Record a sample of your voice (at least 30 seconds recommended for best results).</p>
        
        <div style={{ marginTop: '20px' }}>
          {isRecording ? (
            <div>
              <div className="recording-indicator"></div>
              <span style={{ color: '#ff4136', fontWeight: 'bold' }}>Recording...</span>
              <p>Speak clearly and naturally. Try reading a paragraph or telling a short story.</p>
              <button 
                className="btn" 
                onClick={stopRecording}
                style={{ marginTop: '10px' }}
              >
                Stop Recording
              </button>
            </div>
          ) : (
            <button 
              className="btn" 
              onClick={startRecording}
              disabled={!!audioUrl}
            >
              Start Recording
            </button>
          )}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <p>Or upload an audio file:</p>
          <input 
            type="file" 
            accept="audio/*"
            onChange={handleFileUpload}
            disabled={isRecording || !!audioUrl}
            style={{ marginTop: '10px' }}
          />
        </div>
        
        {audioUrl && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3>Preview</h3>
            <audio 
              src={audioUrl} 
              controls 
              style={{ width: '100%', marginTop: '10px' }}
            />
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setAudioBlob(null);
                setAudioUrl('');
              }}
              style={{ marginTop: '10px' }}
            >
              Discard and Record Again
            </button>
          </div>
        )}
      </div>
      
      {audioUrl && (
        <div className="card">
          <h2>Save Your Voice</h2>
          <div className="form-group">
            <label className="form-label">Voice Name</label>
            <input 
              type="text"
              className="form-control"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="Enter a name for your voice"
            />
          </div>
          
          <button 
            className="btn"
            onClick={uploadVoice}
            disabled={isUploading}
            style={{ marginTop: '10px' }}
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Save Voice'}
          </button>
        </div>
      )}
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffdddd', 
          color: '#d8000c', 
          padding: '10px', 
          borderRadius: '4px', 
          marginTop: '20px' 
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default RecordVoice; 
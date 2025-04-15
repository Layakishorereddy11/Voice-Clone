import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TextToSpeech() {
  const { voiceId } = useParams();
  const navigate = useNavigate();
  
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(voiceId || '');
  const [voices, setVoices] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [error, setError] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  
  const MAX_CHARACTERS = 500;

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await axios.get('/api/voices');
        setVoices(response.data);
        setVoicesLoading(false);
        
        // If we have a voiceId but no selected voice, update it
        if (voiceId && !selectedVoice) {
          setSelectedVoice(voiceId);
        }
        
        // If we don't have a voiceId but we have voices, select the first one
        if (!voiceId && response.data.length > 0 && !selectedVoice) {
          setSelectedVoice(response.data[0].voice_id);
        }
      } catch (err) {
        console.error('Error fetching voices:', err);
        setError('Failed to load voices. Please try again later.');
        setVoicesLoading(false);
      }
    };

    fetchVoices();
  }, [voiceId, selectedVoice]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARACTERS) {
      setText(newText);
      setCharacterCount(newText.length);
    }
  };

  const handleSynthesize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to synthesize.');
      return;
    }
    
    if (!selectedVoice) {
      setError('Please select a voice or create one first.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios({
        method: 'post',
        url: '/api/synthesize',
        data: {
          text,
          voice_id: selectedVoice
        },
        responseType: 'blob'
      });
      
      const url = URL.createObjectURL(response.data);
      setAudioUrl(url);
      setLoading(false);
    } catch (err) {
      console.error('Error synthesizing speech:', err);
      setError('Failed to synthesize speech. Please try again later.');
      setLoading(false);
    }
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
    navigate(`/synthesize/${e.target.value}`, { replace: true });
  };

  return (
    <div>
      <h1>Text to Speech</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffdddd', 
          color: '#d8000c', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}
      
      <div className="card">
        <h2>Generate Speech</h2>
        
        {voicesLoading ? (
          <p>Loading voices...</p>
        ) : voices.length === 0 ? (
          <div>
            <p>You don't have any voices yet. Create one first to use text-to-speech.</p>
            <button 
              className="btn"
              onClick={() => navigate('/record')}
              style={{ marginTop: '10px' }}
            >
              Create a Voice
            </button>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Select Voice</label>
              <select 
                className="form-control"
                value={selectedVoice}
                onChange={handleVoiceChange}
              >
                <option value="">-- Select a voice --</option>
                {voices.map((voice) => (
                  <option key={voice._id} value={voice.voice_id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Enter Text 
                <span style={{ color: characterCount > MAX_CHARACTERS * 0.8 ? 'red' : 'inherit', fontSize: '0.8em', marginLeft: '10px' }}>
                  ({characterCount}/{MAX_CHARACTERS})
                </span>
              </label>
              <textarea 
                className="form-control"
                value={text}
                onChange={handleTextChange}
                placeholder="Enter the text you want to convert to speech..."
                rows={5}
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <button 
              className="btn"
              onClick={handleSynthesize}
              disabled={loading || !selectedVoice || !text.trim()}
            >
              {loading ? 'Generating Speech...' : 'Generate Speech'}
            </button>
            
            {audioUrl && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>Generated Speech</h3>
                <audio 
                  src={audioUrl} 
                  controls 
                  style={{ width: '100%', marginTop: '10px' }}
                />
                <a 
                  href={audioUrl} 
                  download="generated_speech.mp3"
                  className="btn btn-secondary"
                  style={{ marginTop: '10px', display: 'inline-block', textDecoration: 'none' }}
                >
                  Download
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TextToSpeech; 
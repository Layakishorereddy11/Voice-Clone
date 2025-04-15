import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function VoiceList() {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await axios.get('/api/voices');
        setVoices(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching voices:', err);
        setError('Failed to load voices. Please try again later.');
        setLoading(false);
      }
    };

    fetchVoices();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading voices...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>Voices</h1>
      
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
      
      {voices.length === 0 ? (
        <div className="card text-center">
          <h2>No voices found</h2>
          <p>You haven't created any voice clones yet.</p>
          <Link to="/record" style={{ textDecoration: 'none' }}>
            <button className="btn" style={{ marginTop: '15px' }}>
              Create Your First Voice
            </button>
          </Link>
        </div>
      ) : (
        <div className="voice-list">
          {voices.map((voice) => (
            <div key={voice._id} className="voice-card">
              <h3>{voice.name}</h3>
              <p>Created: {new Date(voice.created_at).toLocaleDateString()}</p>
              
              <div className="waveform-container">
                {/* Placeholder for waveform visualization */}
                <div style={{ 
                  height: '100%', 
                  background: 'linear-gradient(90deg, var(--primary-light) 0%, var(--primary-color) 100%)',
                  clipPath: 'polygon(0% 50%, 5% 45%, 10% 40%, 15% 35%, 20% 30%, 25% 40%, 30% 50%, 35% 60%, 40% 65%, 45% 60%, 50% 50%, 55% 40%, 60% 30%, 65% 25%, 70% 30%, 75% 40%, 80% 50%, 85% 60%, 90% 65%, 95% 55%, 100% 50%)'
                }}></div>
              </div>
              
              <audio 
                src={`/api/audio/${voice.voice_id}.wav`} 
                controls
                style={{ width: '100%', marginBottom: '15px' }}
              />
              
              <Link 
                to={`/synthesize/${voice.voice_id}`}
                style={{ textDecoration: 'none' }}
              >
                <button className="btn" style={{ width: '100%' }}>
                  Use This Voice
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VoiceList; 
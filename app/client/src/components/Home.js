import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h1>Welcome to Voice Clone</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '20px auto' }}>
          Create your own voice clone and generate speech that sounds just like you.
          Upload a short voice sample, and our AI will learn your unique voice patterns.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
          <Link to="/record" style={{ textDecoration: 'none' }}>
            <button className="btn">
              Record Your Voice
            </button>
          </Link>
          <Link to="/voices" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary">
              Browse Voices
            </button>
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              minWidth: '50px', 
              height: '50px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '25px',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>1</div>
            <div>
              <h3>Record a Voice Sample</h3>
              <p>Record a short voice sample (30 seconds or more) or upload an existing audio file.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              minWidth: '50px', 
              height: '50px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '25px',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>2</div>
            <div>
              <h3>AI Learns Your Voice</h3>
              <p>Our advanced AI analyzes your voice's unique characteristics and creates a voice model.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              minWidth: '50px', 
              height: '50px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '25px',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>3</div>
            <div>
              <h3>Generate Speech</h3>
              <p>Enter any text, and hear it spoken in your voice. Download the audio files for your projects.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 
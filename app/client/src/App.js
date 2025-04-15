import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import RecordVoice from './components/RecordVoice';
import VoiceList from './components/VoiceList';
import TextToSpeech from './components/TextToSpeech';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/record" element={<RecordVoice />} />
          <Route path="/voices" element={<VoiceList />} />
          <Route path="/synthesize/:voiceId" element={<TextToSpeech />} />
          <Route path="/synthesize" element={<TextToSpeech />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App; 
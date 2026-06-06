import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CharacterSelect from './pages/CharacterSelect';
import PlayArea from './pages/PlayArea';

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState('witch');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select" element={<CharacterSelect selectedCharacter={selectedCharacter} setSelectedCharacter={setSelectedCharacter} />} />
        <Route path="/play" element={<PlayArea selectedCharacter={selectedCharacter} />} />
      </Routes>
    </Router>
  );
}
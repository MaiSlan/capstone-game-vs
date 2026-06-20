import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CharacterSelect from './pages/CharacterSelect';
import PlayArea from './pages/PlayArea';
import ProtectedRoute from './components/ProtectedRoute';
import CampfireShop from './pages/BoneFireShop';

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState('witch');

  return (
    <Router>
      <Routes>
        {/* Public Routes (Accessible to anyone) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes (Requires a valid game_token) */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/select" element={
          <ProtectedRoute>
            <CharacterSelect 
              selectedCharacter={selectedCharacter} 
              setSelectedCharacter={setSelectedCharacter} 
            />
          </ProtectedRoute>
        } />

        {/* --- NEW: The BoneFire Shop Route --- */}
        <Route path="/shop" element={
          <ProtectedRoute>
            <CampfireShop />
          </ProtectedRoute>
        } />
        
        <Route path="/play" element={
          <ProtectedRoute>
            <PlayArea selectedCharacter={selectedCharacter} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
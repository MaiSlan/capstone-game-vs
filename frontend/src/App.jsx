import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PlayArea from './pages/PlayArea';
import ProtectedRoute from './components/ProtectedRoute';
import CampfireShop from './pages/BoneFireShop';
import Bestiary from './pages/Bestiary';
import ProfileStats from './pages/ProfileStats';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Engine Route (The True Game) */}
        <Route path="/play" element={
          <ProtectedRoute>
            <PlayArea />
          </ProtectedRoute>
        } />

        {/* Protected Out-of-Engine Pages */}
        <Route path="/shop" element={
          <ProtectedRoute>
            <CampfireShop />
          </ProtectedRoute>
        } />
        
        <Route path="/bestiary" element={
          <ProtectedRoute>
            <Bestiary />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileStats />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
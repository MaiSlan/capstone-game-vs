import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-12 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
        VS Cloud Engine
      </h1>
      <button 
        onClick={() => navigate('/select')} 
        className="px-12 py-4 bg-purple-600 rounded-full font-bold text-2xl hover:bg-purple-500 transition shadow-[0_0_20px_rgba(168,85,247,0.6)]"
      >
        PLAY
      </button>
    </div>
  );
}
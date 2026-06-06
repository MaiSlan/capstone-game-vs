import { useNavigate } from 'react-router-dom';

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full h-20 bg-zinc-950/80 backdrop-blur-md border-b border-purple-900/50 flex items-center justify-between px-8 fixed top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <span className="text-2xl">🦇</span>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 tracking-wide">
          VS Cloud Engine
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-8 text-zinc-400 font-medium">
        <a href="#features" className="hover:text-pink-400 transition">Features</a>
        <a href="#architecture" className="hover:text-pink-400 transition">Architecture</a>
        <a href="#tech" className="hover:text-pink-400 transition">Tech Stack</a>
      </div>

      <button 
        onClick={() => navigate('/auth')}
        className="px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
      >
        PLAY NOW
      </button>
    </nav>
  );
}
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-neon-bg z-0 pointer-events-none" />
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 243, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(255, 0, 255, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between py-8 px-4 sm:px-6">
        
        {/* Header */}
        <header className="w-full max-w-4xl flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-neon-blue blur-[100px] opacity-10" />
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-green to-neon-pink drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] tracking-tighter uppercase flex items-center gap-3">
            <Sparkles className="text-neon-pink w-6 h-6 md:w-8 md:h-8" />
            Neon Snake Synth
            <Sparkles className="text-neon-blue w-6 h-6 md:w-8 md:h-8" />
          </h1>
        </header>

        {/* Game Area */}
        <main className="flex-1 flex flex-col items-center justify-center w-full min-h-[450px]">
          <SnakeGame />
        </main>

        {/* Music Player Footer */}
        <footer className="w-full mt-8 md:mt-12 sticky bottom-4 z-50">
          <MusicPlayer />
        </footer>
      </div>
    </div>
  );
}

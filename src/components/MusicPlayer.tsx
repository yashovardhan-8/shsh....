import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Skyline (AI Gen)',
    artist: 'Syntax AI',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Cybernetic Groove (AI Gen)',
    artist: 'Neural Beats',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Digital Horizon (AI Gen)',
    artist: 'Deep Void',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="bg-neon-panel border border-neon-pink/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,0,255,0.15)] flex flex-col md:flex-row items-center gap-6 w-full max-w-4xl mx-auto backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 w-full md:w-1/3">
        <div className={`w-14 h-14 rounded-full bg-neon-bg border-2 border-neon-pink flex flex-shrink-0 items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.6)] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
          <Music className="text-neon-pink w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-bold text-lg truncate text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
            {currentTrack.title}
          </h3>
          <p className="text-neon-pink/80 text-sm truncate font-medium">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
        <div className="flex items-center gap-6">
          <button 
            onClick={skipBack}
            className="text-white hover:text-neon-blue transition-colors focus:outline-none"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-neon-blue text-neon-bg hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,243,255,0.6)] focus:outline-none"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-neon-bg ml-0" />
            ) : (
              <Play className="w-6 h-6 fill-neon-bg ml-1" />
            )}
          </button>
          <button 
            onClick={skipForward}
            className="text-white hover:text-neon-blue transition-colors focus:outline-none"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.8)] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Volume */}
      <div className="hidden md:flex items-center justify-end gap-3 w-full md:w-1/3">
        <button onClick={toggleMute} className="text-white hover:text-neon-pink transition-colors focus:outline-none">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-24 accent-neon-pink"
        />
      </div>
    </div>
  );
}

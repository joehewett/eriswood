import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume1, Volume2, ChevronDown, ChevronUp, Music2 } from 'lucide-react';

const tracks = [
  { title: 'Al Kharid', src: '/music/alkharid.mp3' },
  { title: 'Bone Dry', src: '/music/bonedry.mp3' },
  { title: 'Dark', src: '/music/dark.mp3' },
  { title: "Diango's Little Helpers", src: '/music/diangoslittlehelpers.mp3' },
  { title: 'Gnome Theme', src: '/music/gnometheme.mp3' },
  { title: 'Marooned', src: '/music/marooned.mp3' },
];

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // default 50%
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load new track when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = tracks[currentTrackIndex].src;
    if (isPlaying) {
      void audio.play();
    }
  }, [currentTrackIndex]);

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      void audio.pause();
    } else {
      void audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  // Auto-advance on track end
  const handleEnded = () => {
    playNext();
  };

  // Ensure play state sync when isPlaying changes (e.g., first render)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // keep volume in sync
    audio.volume = volume;

    if (isPlaying) {
      void audio.play();
    } else {
      void audio.pause();
    }
  }, [isPlaying]);

  // Update audio volume when slider moves
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`fixed bottom-4 right-4 ${isMinimized ? 'w-44 p-1.5' : 'w-56 p-3'} bg-gradient-to-br from-stone-800/95 to-stone-900/90 text-stone-200 border border-stone-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] z-50 select-none font-mono`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1 truncate text-xs" title={tracks[currentTrackIndex].title}>
          <Music2 size={12} />
          <span className="truncate">{tracks[currentTrackIndex].title}</span>
        </div>
        <button onClick={toggleMinimize} aria-label={isMinimized ? 'Expand player' : 'Minimize player'} className="hover:text-emerald-300 transition-colors">
          {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isMinimized ? null : (
      <>
        <div className="flex items-center justify-center space-x-3 mb-2">
          <button
            aria-label="Previous track"
            className="hover:text-emerald-300 transition-colors"
            onClick={playPrev}
          >
            <SkipBack size={18} />
          </button>
          <button
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="hover:text-emerald-300 transition-colors"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button
            aria-label="Next track"
            className="hover:text-emerald-300 transition-colors"
            onClick={playNext}
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Volume slider */}
        <div className="flex items-center space-x-1 px-0.5">
          <Volume1 size={12} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 accent-emerald-400 h-1 cursor-pointer"
          />
          <Volume2 size={12} />
        </div>
      </>
      )}

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleEnded} preload="auto" />
    </div>
  );
};

export default MusicPlayer;

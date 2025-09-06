import { useRef, useState, useCallback } from 'react';

export interface AudioClip {
  id: string;
  src: string;
  name?: string;
}

export const useAudioSystem = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentClipId, setCurrentClipId] = useState<string | null>(null);

  const playAudio = useCallback(async (clip: AudioClip): Promise<void> => {
    // Stop any currently playing audio
    stopAudio();

    try {
      // Create new audio element
      const audio = new Audio(clip.src);
      audioRef.current = audio;
      setCurrentClipId(clip.id);
      setIsPlaying(true);

      // Set up event handlers
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentClipId(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        console.error(`Failed to load audio: ${clip.src}`);
        setIsPlaying(false);
        setCurrentClipId(null);
        audioRef.current = null;
      };

      // Play the audio
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setCurrentClipId(null);
      audioRef.current = null;
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentClipId(null);
  }, []);

  const isPlayingClip = useCallback((clipId: string): boolean => {
    return isPlaying && currentClipId === clipId;
  }, [isPlaying, currentClipId]);

  return {
    playAudio,
    stopAudio,
    isPlaying,
    currentClipId,
    isPlayingClip
  };
};

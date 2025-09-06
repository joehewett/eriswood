import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GameLocation, MapRect, Position } from '../types';

interface NpcAudioPlayerProps {
  isVisible: boolean;
  props?: {
    npcId: string;
    audioSrc: string;
    displayName?: string;
    location: GameLocation;
    // Optional: in-canvas coordinates of the NPC for proximity stop if player walks away
    npcCanvasPosition?: Position;
    stopDistance?: number; // in canvas units
  };
  playerCanvasPosition: Position;
  currentLocation: GameLocation;
  onHide: () => void;
}

export const NpcAudioPlayer: React.FC<NpcAudioPlayerProps> = ({
  isVisible,
  props,
  playerCanvasPosition,
  currentLocation,
  onHide
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const effectiveStopDistance = props?.stopDistance ?? 200; // default canvas distance

  // Start/stop playback based on visibility and location match
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isVisible && props && props.location === currentLocation) {
      audio.src = props.audioSrc;
      void audio.play();
      setIsPlaying(true);
    } else {
      void audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isVisible, props?.audioSrc, props?.location, currentLocation]);

  // Stop if the player walks away from the NPC beyond stopDistance
  useEffect(() => {
    if (!isVisible || !props?.npcCanvasPosition) return;
    const dx = playerCanvasPosition.x - props.npcCanvasPosition.x;
    const dy = playerCanvasPosition.y - props.npcCanvasPosition.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > effectiveStopDistance) {
      onHide();
    }
  }, [playerCanvasPosition.x, playerCanvasPosition.y, isVisible, props?.npcCanvasPosition?.x, props?.npcCanvasPosition?.y, effectiveStopDistance, onHide]);

  // Stop if location changes away from the NPC's location
  useEffect(() => {
    if (!isVisible || !props) return;
    if (currentLocation !== props.location) {
      onHide();
    }
  }, [currentLocation, isVisible, props, onHide]);

  if (!isVisible || !props) return null;

  return (
    <>
      <audio ref={audioRef} preload="auto" />
    </>
  );
};



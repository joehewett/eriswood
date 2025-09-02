import { useEffect, useRef } from 'react';
import { GameLocation } from '../types';

interface UseGameLoopProps {
  updatePlayerPosition: () => void;
  updateNPCPosition: () => void;
  handlePlayerKeyDown: (event: KeyboardEvent) => void;
  handlePlayerKeyUp: (event: KeyboardEvent) => void;
  handleInteraction: (onLocationChange: (location: GameLocation) => void) => void;
  onLocationChange: (location: GameLocation) => void;
  mapRect: { width: number; height: number };
}

export const useGameLoop = ({
  updatePlayerPosition,
  updateNPCPosition,
  handlePlayerKeyDown,
  handlePlayerKeyUp,
  handleInteraction,
  onLocationChange,
  mapRect
}: UseGameLoopProps) => {
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handlePlayerKeyDown(event);
      
      // Handle interaction with NPC
      if (event.key.toLowerCase() === 'x') {
        event.preventDefault();
        event.stopPropagation();
        handleInteraction(onLocationChange);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      handlePlayerKeyUp(event);
    };

    const gameLoop = () => {
      // If map not ready yet, keep the loop going
      if (mapRect.width === 0 || mapRect.height === 0) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      updatePlayerPosition();
      updateNPCPosition();

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updatePlayerPosition, updateNPCPosition, handlePlayerKeyDown, handlePlayerKeyUp, handleInteraction, onLocationChange, mapRect]);
};

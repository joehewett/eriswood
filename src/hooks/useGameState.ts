import { useState, useEffect } from 'react';
import { GameLocation } from '../types';
import { gameConfig, isWithinProximity, getLocationImageSrc } from '../utils';

interface UseGameStateProps {
  playerPosition: { x: number; y: number };
  npcPosition: { x: number; y: number };
  currentLocation: GameLocation;
}

export const useGameState = ({ playerPosition, npcPosition, currentLocation }: UseGameStateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  // Check proximity for greeting - only in village
  useEffect(() => {
    if (currentLocation === GameLocation.VILLAGE) {
      const shouldShowGreeting = isWithinProximity(playerPosition, npcPosition);
      setShowGreeting(shouldShowGreeting);
    } else {
      setShowGreeting(false);
    }
  }, [playerPosition, npcPosition, currentLocation]);

  const handleInteraction = (onLocationChange: (location: GameLocation) => void) => {
    if (currentLocation === GameLocation.VILLAGE && !isLoading) {
      const isCloseEnough = isWithinProximity(playerPosition, npcPosition);
      
      if (isCloseEnough) {
        setIsLoading(true);
        
        // Preload the library image
        const newLocation = GameLocation.LIBRARY;
        const img = new Image();
        img.src = getLocationImageSrc(newLocation);
        
        // Wait for both the loading duration and image to load
        const loadingTimer = new Promise(resolve => 
          setTimeout(resolve, gameConfig.loadingDuration)
        );
        
        const imageLoader = new Promise(resolve => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true); // Continue even if image fails to load
          }
        });
        
        Promise.all([loadingTimer, imageLoader]).then(() => {
          onLocationChange(newLocation);
          setIsLoading(false);
        });
      }
    }
  };

  return {
    isLoading,
    showGreeting,
    handleInteraction
  };
};

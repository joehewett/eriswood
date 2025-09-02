import { useState, useEffect, useMemo } from 'react';
import { GameLocation, InteractionZone } from '../types';
import { getInteractionZonesForLocation, findNearbyInteractionZone, convertRelativeZonesToCanvas } from '../utils';

interface UseBuildingInteractionsProps {
  playerPosition: { x: number; y: number };
  currentLocation: GameLocation;
  imageBounds: { x: number; y: number; width: number; height: number };
}

export const useBuildingInteractions = ({ playerPosition, currentLocation, imageBounds }: UseBuildingInteractionsProps) => {
  const [currentInteractionZone, setCurrentInteractionZone] = useState<InteractionZone | null>(null);
  const [showInteractionPrompt, setShowInteractionPrompt] = useState(false);

  // Get interaction zones for current location and convert to absolute coordinates
  const interactionZones = useMemo(() => {
    const relativeZones = getInteractionZonesForLocation(currentLocation);
    return convertRelativeZonesToCanvas(relativeZones);
  }, [currentLocation, imageBounds.x, imageBounds.y, imageBounds.width, imageBounds.height]);

  // Check if player is in any interaction zone
  useEffect(() => {
    if (imageBounds.width > 0 && imageBounds.height > 0) {
      const zone = findNearbyInteractionZone(playerPosition, interactionZones, 96, 64); // Larger margin for easier interaction
      setCurrentInteractionZone(zone);
      setShowInteractionPrompt(!!zone);
    }
  }, [playerPosition.x, playerPosition.y, interactionZones, imageBounds.width, imageBounds.height]);

  return {
    currentInteractionZone,
    showInteractionPrompt,
    interactionZones
  };
};

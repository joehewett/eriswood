import { useState, useEffect } from 'react';
import { MapRect, GameLocation } from '../types';
import { computeMapLayout, getLocationImageSrc } from '../utils';

export const useMapLayout = (currentLocation: GameLocation) => {
  const [mapRect, setMapRect] = useState<MapRect>({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = getLocationImageSrc(currentLocation);

    const computeLayout = (naturalWidth: number, naturalHeight: number) => {
      const rect = computeMapLayout(naturalWidth, naturalHeight);
      setMapRect(rect);
    };

    const handleResize = () => {
      if (img.naturalWidth && img.naturalHeight) {
        computeLayout(img.naturalWidth, img.naturalHeight);
      }
    };

    img.onload = () => {
      computeLayout(img.naturalWidth, img.naturalHeight);
      window.addEventListener('resize', handleResize);
    };

    // Fallback if image is cached and already complete
    if (img.complete && img.naturalWidth) {
      computeLayout(img.naturalWidth, img.naturalHeight);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentLocation]);

  return mapRect;
};

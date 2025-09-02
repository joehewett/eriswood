import { useState, useEffect } from 'react';
import { MapRect } from '../types';
import { computeFixedCanvasLayout } from '../utils';

export const useFixedCanvasLayout = () => {
  const [mapRect, setMapRect] = useState<MapRect>({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    const computeLayout = () => {
      const rect = computeFixedCanvasLayout();
      setMapRect(rect);
    };

    // Compute initial layout
    computeLayout();

    // Update on window resize
    const handleResize = () => {
      computeLayout();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return mapRect;
};

import { useState, useEffect } from 'react';
import { MapRect } from '../types';
import { computeFixedCanvasLayout } from '../utils';

/**
 * Provides a centred, non-scaling 1600×900 map rectangle.
 * Recomputes the offset on window resize.
 */
export const useCenteredFixedCanvasLayout = (): MapRect => {
  const [mapRect, setMapRect] = useState<MapRect>(() => computeFixedCanvasLayout());

  useEffect(() => {
    const handleResize = () => {
      setMapRect(computeFixedCanvasLayout());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return mapRect;
};

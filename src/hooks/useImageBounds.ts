import { useState, useEffect, useRef } from 'react';
import { GameLocation } from '../types';
import { getLocationImageSrc } from '../utils';

interface ImageBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
  scale: number;
}

export const useImageBounds = (currentLocation: GameLocation) => {
  const [imageBounds, setImageBounds] = useState<ImageBounds>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    scale: 1
  });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const naturalWidth = imageRef.current.naturalWidth;
        const naturalHeight = imageRef.current.naturalHeight;
        const scale = Math.min(rect.width / naturalWidth, rect.height / naturalHeight);
        
        setImageBounds({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          naturalWidth,
          naturalHeight,
          scale
        });
      }
    };

    // Update bounds when image loads
    const img = imageRef.current;
    if (img) {
      if (img.complete) {
        updateBounds();
      } else {
        img.onload = updateBounds;
      }
    }

    // Update bounds on window resize
    window.addEventListener('resize', updateBounds);
    
    return () => {
      window.removeEventListener('resize', updateBounds);
    };
  }, [currentLocation]);

  // Convert relative coordinates (0-1) to absolute screen coordinates
  const relativeToAbsolute = (relativeX: number, relativeY: number) => {
    return {
      x: imageBounds.x + (relativeX * imageBounds.width),
      y: imageBounds.y + (relativeY * imageBounds.height)
    };
  };

  // Convert absolute coordinates to relative (0-1)
  const absoluteToRelative = (absoluteX: number, absoluteY: number) => {
    return {
      x: (absoluteX - imageBounds.x) / imageBounds.width,
      y: (absoluteY - imageBounds.y) / imageBounds.height
    };
  };

  return {
    imageBounds,
    imageRef,
    relativeToAbsolute,
    absoluteToRelative
  };
};

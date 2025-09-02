import React from 'react';
import { Position } from '../types';
import { getCharacterImageSrc } from '../utils';

interface CharacterProps {
  position: Position;
  currentFrame: number;
  alt: string;
  isNPC?: boolean;
  spriteVariant?: number;
  facingDirection?: 'left' | 'right';
  showDebugBounds?: boolean;
}

export const Character: React.FC<CharacterProps> = ({ 
  position, 
  currentFrame, 
  alt, 
  isNPC = false,
  spriteVariant = 0,
  facingDirection = 'right',
  showDebugBounds = false
}) => {
  return (
    <>
      <img
        src={getCharacterImageSrc(currentFrame)}
        alt={alt}
        className={`absolute ${facingDirection === 'left' ? 'scale-x-[-1]' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '64px',
          height: '64px',
          imageRendering: 'pixelated',
          transition: 'none',
          zIndex: 2,
          filter: isNPC ? 'hue-rotate(120deg)' : spriteVariant > 0 ? `hue-rotate(${spriteVariant * 60}deg)` : 'none'
        }}
      />
      {showDebugBounds && (
        <>
          {/* Character bounding box */}
          <div
            className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20 pointer-events-none"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: '64px',
              height: '64px',
              zIndex: 15
            }}
          />
          {/* Character center point */}
          <div
            className="absolute bg-red-600 pointer-events-none"
            style={{
              left: `${position.x + 32 - 2}px`,
              top: `${position.y + 32 - 2}px`,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              zIndex: 16
            }}
          />
          {/* Position label */}
          <div
            className="absolute text-xs font-mono text-red-600 bg-white bg-opacity-80 px-1 pointer-events-none"
            style={{
              left: `${position.x}px`,
              top: `${position.y - 20}px`,
              zIndex: 17
            }}
          >
            ({Math.round(position.x)}, {Math.round(position.y)})
          </div>
        </>
      )}
    </>
  );
};

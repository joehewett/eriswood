import React from 'react';
import { Position } from '../types';

interface ProximityVisualizationProps {
  playerPosition: Position;
  proximityRadius: number;
  characterSize: number;
  showDebug?: boolean;
}

export const ProximityVisualization: React.FC<ProximityVisualizationProps> = ({
  playerPosition,
  proximityRadius,
  characterSize,
  showDebug = false
}) => {
  if (!showDebug) return null;

  const centerX = playerPosition.x + characterSize / 2;
  const centerY = playerPosition.y + characterSize / 2;

  return (
    <>
      {/* Proximity detection circle */}
      <div
        className="absolute border-2 border-dashed border-cyan-400 bg-cyan-400 bg-opacity-10 pointer-events-none rounded-full"
        style={{
          left: `${centerX - proximityRadius}px`,
          top: `${centerY - proximityRadius}px`,
          width: `${proximityRadius * 2}px`,
          height: `${proximityRadius * 2}px`,
          zIndex: 8
        }}
      />
      
      {/* Character collision box (different from visual bounds) */}
      <div
        className="absolute border border-orange-400 bg-orange-400 bg-opacity-20 pointer-events-none"
        style={{
          left: `${playerPosition.x}px`,
          top: `${playerPosition.y}px`,
          width: `${characterSize}px`,
          height: `${characterSize}px`,
          zIndex: 14
        }}
      />
      
      {/* Proximity radius label */}
      <div
        className="absolute text-xs font-mono text-cyan-600 bg-white bg-opacity-80 px-1 pointer-events-none"
        style={{
          left: `${centerX + proximityRadius - 30}px`,
          top: `${centerY - proximityRadius - 15}px`,
          zIndex: 18
        }}
      >
        r={proximityRadius}
      </div>
    </>
  );
};

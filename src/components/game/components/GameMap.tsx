import React, { forwardRef } from 'react';
import { GameLocation, MapRect } from '../types';
import { getLocationImageSrc, getLocationAltText, gameConfig } from '../utils';

interface GameMapProps {
  currentLocation: GameLocation;
  mapRect: MapRect;
}

export const GameMap = forwardRef<HTMLImageElement, GameMapProps>(
  ({ currentLocation, mapRect }, ref) => {
    const scale = mapRect.width / gameConfig.FIXED_CANVAS_WIDTH;

    return (
      <div
        className="absolute border-4 border-[#ab8b65] shadow-[4px_4px_0_0_#000,8px_8px_0_0_#3b2f19] box-border overflow-hidden"
        style={{
          zIndex: 1,
          width: `${gameConfig.FIXED_CANVAS_WIDTH}px`,
          height: `${gameConfig.FIXED_CANVAS_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          left: `${mapRect.x}px`,
          top: `${mapRect.y}px`,
        }}
      >
        <img
          ref={ref}
          src={getLocationImageSrc(currentLocation)}
          alt={getLocationAltText(currentLocation)}
          className="w-full h-full block select-none"
          draggable={false}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    );
  }
);

GameMap.displayName = 'GameMap';

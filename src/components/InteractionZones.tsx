import React from 'react';
import { InteractionZone } from '../types';
import { MapRect } from '../types';

interface InteractionZonesProps {
  zones: InteractionZone[]; // Canvas coordinates (0-1600,0-900)
  mapRect: MapRect;
  showDebug?: boolean;
  playerPosition?: { x: number; y: number }; // Screen coordinates for highlighting
  proximityRadius?: number;
}

export const InteractionZones: React.FC<InteractionZonesProps> = ({ 
  zones, 
  mapRect,
  showDebug = false, 
  playerPosition,
  proximityRadius = 32
}) => {
  if (!showDebug) return null;

  const scaleX = mapRect.width / 1600;
  const scaleY = mapRect.height / 900;

  const zoneToScreen = (z: InteractionZone) => ({
    screenX: mapRect.x + (z.x ?? 0) * scaleX,
    screenY: mapRect.y + (z.y ?? 0) * scaleY,
    screenW: (z.width ?? 0) * scaleX,
    screenH: (z.height ?? 0) * scaleY
  });

  const isPlayerNearZone = (zone: InteractionZone) => {
    if (!playerPosition) return false;
    const { screenX: zoneX, screenY: zoneY, screenW: zoneWidth, screenH: zoneHeight } = zoneToScreen(zone);
    
    const px = playerPosition.x + 32; // Character center
    const py = playerPosition.y + 32; // Character center
    
    return (
      px >= zoneX - proximityRadius &&
      px <= zoneX + zoneWidth + proximityRadius &&
      py >= zoneY - proximityRadius &&
      py <= zoneY + zoneHeight + proximityRadius
    );
  };

  return (
    <>
      {zones.map((zone) => {
        const { screenX, screenY, screenW, screenH } = zoneToScreen(zone);
        const isNear = isPlayerNearZone(zone);
        return (
          <div key={zone.id}>
            {/* Main interaction zone */}
            <div
              className={`absolute border-2 pointer-events-none ${
                isNear 
                  ? 'border-green-400 bg-green-400 bg-opacity-30' 
                  : 'border-yellow-400 bg-yellow-400 bg-opacity-10'
              }`}
              style={{
                left: `${screenX}px`,
                top: `${screenY}px`,
                width: `${screenW}px`,
                height: `${screenH}px`,
                zIndex: 10
              }}
            >
              <div className={`text-xs font-bold p-1 ${
                isNear ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {zone.name}
              </div>
            </div>
            
            {/* Proximity detection area */}
            <div
              className="absolute border border-dashed border-blue-300 bg-transparent pointer-events-none"
              style={{
                left: `${screenX - proximityRadius}px`,
                top: `${screenY - proximityRadius}px`,
                width: `${screenW + 2 * proximityRadius}px`,
                height: `${screenH + 2 * proximityRadius}px`,
                zIndex: 9
              }}
            />
            
            {/* Zone center point */}
            <div
              className="absolute bg-purple-500 pointer-events-none"
              style={{
                left: `${screenX + screenW / 2 - 2}px`,
                top: `${screenY + screenH / 2 - 2}px`,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                zIndex: 11
              }}
            />
            
            {/* Zone coordinates */}
            <div
              className="absolute text-xs font-mono text-purple-600 bg-white bg-opacity-80 px-1 pointer-events-none"
              style={{
                left: `${screenX}px`,
                top: `${screenY + screenH + 5}px`,
                zIndex: 12
              }}
            >
              x:{Math.round(zone.x ?? 0)} y:{Math.round(zone.y ?? 0)} w:{Math.round(zone.width ?? 0)} h:{Math.round(zone.height ?? 0)}
            </div>
            
            {/* Relative coordinates */}
            <div
              className="absolute text-xs font-mono text-blue-600 bg-white bg-opacity-80 px-1 pointer-events-none"
              style={{
                left: `${screenX}px`,
                top: `${screenY + screenH + 20}px`,
                zIndex: 12
              }}
            >
              rel: {zone.relativeX?.toFixed(2)}, {zone.relativeY?.toFixed(2)}
            </div>
          </div>
        );
      })}
    </>
  );
};

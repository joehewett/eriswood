import React from 'react';
import { InteractionZone, MapRect } from '../types';
import { getInteractionZoneCenter, canvasToScreenPosition } from '../utils';

interface BuildingInteractionPromptProps {
  zone: InteractionZone | null; // Canvas coordinates
  show: boolean;
  mapRect: MapRect;
}

export const BuildingInteractionPrompt: React.FC<BuildingInteractionPromptProps> = ({ zone, show, mapRect }) => {
  if (!show || !zone) return null;

  const centerCanvas = getInteractionZoneCenter(zone);
  const centerScreen = canvasToScreenPosition(centerCanvas, mapRect);

  return (
    <div
      className="absolute flex flex-col items-center justify-center text-white border-2 border-white rounded font-mono font-bold pointer-events-none"
      style={{
        left: `${centerScreen.x - 40}px`,
        top: `${centerScreen.y - 60}px`,
        width: 'fit-content',
        height: '40px',
        transform: 'translateX(-50%)',
        padding: '4px 12px',
        whiteSpace: 'nowrap',
        backgroundColor: '#000',
        fontSize: '12px',
        zIndex: 15,
        boxShadow: '2px 2px 0px #666'
      }}
    >
      <div className="text-xs">{zone.description}</div>
      <div className="text-sm font-bold">Press X</div>
      
      {/* Speech bubble tail */}
      <div
        className="absolute"
        style={{
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '8px solid #000'
        }}
      />
    </div>
  );
};

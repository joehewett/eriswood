import React from 'react';
import { Position } from '../types';
import { gameConfig } from '../utils';

interface InteractionPromptProps {
  npcPosition: Position;
  show: boolean;
}

export const InteractionPrompt: React.FC<InteractionPromptProps> = ({ npcPosition, show }) => {
  if (!show) return null;

  return (
    <div
      className="absolute flex items-center justify-center text-white border-2 border-white rounded font-mono font-bold"
      style={{
        left: `${npcPosition.x + gameConfig.hedgehogSize / 2 - 15}px`,
        top: `${npcPosition.y - 40}px`,
        width: '30px',
        height: '25px',
        backgroundColor: '#000',
        fontSize: '14px',
        zIndex: 3,
        boxShadow: '2px 2px 0px #666'
      }}
    >
      X
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

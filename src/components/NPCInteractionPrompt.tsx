import React from 'react';
import { NPCData } from '../hooks/useMultipleNPCs';
import { MapRect } from '../types';

interface NPCInteractionPromptProps {
  npc: NPCData | null;
  show: boolean;
  mapRect: MapRect;
}

export const NPCInteractionPrompt: React.FC<NPCInteractionPromptProps> = ({ 
  npc, 
  show, 
  mapRect 
}) => {
  if (!show || !npc || mapRect.width === 0) {
    return null;
  }

  // Position the prompt above the NPC
  const promptX = npc.position.x;
  const promptY = npc.position.y - 80; // Position above the NPC

  return (
    <div
      className="absolute bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-medium pointer-events-none z-20 whitespace-nowrap"
      style={{
        left: `${promptX}px`,
        top: `${promptY}px`,
        transform: 'translateX(-50%)', // Center horizontally
      }}
    >
      <div className="flex items-center gap-2">
        <span>Press</span>
        <span className="bg-white text-black px-2 py-1 rounded text-xs font-bold">X</span>
        <span>to talk to {npc.name}</span>
      </div>
      {npc.isTalking && (
        <div className="text-center mt-1 text-xs text-green-400">
          🗣️ Speaking...
        </div>
      )}
    </div>
  );
};

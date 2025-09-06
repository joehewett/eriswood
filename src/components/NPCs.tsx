import React from 'react';
import { Character } from './Character';
import { NPCData } from '../hooks/useMultipleNPCs';

interface NPCsProps {
  npcs: NPCData[];
  showDebugBounds?: boolean;
}

export const NPCs: React.FC<NPCsProps> = ({ npcs, showDebugBounds = false }) => {
  return (
    <>
      {npcs.map((npc) => (
        <Character
          key={npc.id}
          position={npc.position}
          currentFrame={npc.frame}
          alt={`NPC ${npc.name}`}
          isNPC={true}
          facingDirection={npc.facingDirection}
          showDebugBounds={showDebugBounds}
        />
      ))}
    </>
  );
};

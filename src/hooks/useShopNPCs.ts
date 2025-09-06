import { useEffect, useMemo, useRef, useState } from 'react';
import { GameLocation, InteractionZone, Position } from '../types';
import { convertRelativeZonesToCanvas, gameConfig, getInteractionZonesForLocation } from '../utils';

interface NpcInternalState {
  id: string;
  position: Position; // canvas coords
  frame: number;
  isMoving: boolean;
  facingDirection: 'left' | 'right';
  direction: Position; // unit vector -1,0,1 on x/y
  moveTimer: number;
  frameCounter: number;
  homeZone?: InteractionZone; // canvas coords
}

export const useShopNPCs = (currentLocation: GameLocation) => {
  const [npcs, setNpcs] = useState<NpcInternalState[]>([]);
  const npcsRef = useRef<NpcInternalState[]>([]);

  // Initialize NPCs when entering the shop
  useEffect(() => {
    if (currentLocation !== GameLocation.SHOP) {
      setNpcs([]);
      npcsRef.current = [];
      return;
    }

    const zones = convertRelativeZonesToCanvas(
      getInteractionZonesForLocation(GameLocation.SHOP).filter(z => z.id.startsWith('npc-'))
    );

    const initial: NpcInternalState[] = zones.map((z, idx) => {
      const x = (z.x ?? 0) + (z.width ?? 0) / 2 - gameConfig.hedgehogSize / 2;
      const y = (z.y ?? 0) + (z.height ?? 0) / 2 - gameConfig.hedgehogSize / 2;
      return {
        id: z.id,
        position: { x, y },
        frame: 0,
        isMoving: false,
        facingDirection: 'right',
        direction: { x: 0, y: 0 },
        moveTimer: 0,
        frameCounter: 0,
        homeZone: z
      };
    });

    setNpcs(initial);
    npcsRef.current = initial;
  }, [currentLocation]);

  const updateNpcPositions = () => {
    if (currentLocation !== GameLocation.SHOP) return;

    // Shallow copy to mutate per-NPC state
    const next = npcsRef.current.map(npc => {
      let { position, direction, moveTimer, frameCounter, frame, isMoving, facingDirection } = npc;

      moveTimer += 1;

      // change direction at intervals
      if (moveTimer % gameConfig.npcDirectionChangeInterval === 0) {
        const shouldStop = Math.random() < 0.3;
        if (shouldStop) {
          direction = { x: 0, y: 0 };
        } else {
          const dirs = [
            { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 },
            { x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: 1 }
          ];
          direction = dirs[Math.floor(Math.random() * dirs.length)];
        }
      }

      let newX = position.x + direction.x * gameConfig.npcSpeed;
      let newY = position.y + direction.y * gameConfig.npcSpeed;

      // Keep within an expanded bounding box around their home zone
      const hz = npc.homeZone;
      if (hz) {
        const bx = (hz.x ?? 0) - (hz.width ?? 0);
        const by = (hz.y ?? 0) - (hz.height ?? 0);
        const bw = (hz.width ?? 0) * 3;
        const bh = (hz.height ?? 0) * 3;
        // Constrain within [bx, bx+bw] and [by, by+bh]
        if (newX < bx) newX = bx;
        if (newX > bx + bw - gameConfig.hedgehogSize) newX = bx + bw - gameConfig.hedgehogSize;
        if (newY < by) newY = by;
        if (newY > by + bh - gameConfig.hedgehogSize) newY = by + bh - gameConfig.hedgehogSize;
      }

      const hasMovement = direction.x !== 0 || direction.y !== 0;
      isMoving = hasMovement;
      if (hasMovement) {
        frameCounter += 1;
        if (frameCounter % gameConfig.npcFrameUpdateInterval === 0) {
          frame = frame === 0 ? 1 : 0;
        }
        // update facing from x movement preference
        if (direction.x < 0) facingDirection = 'left';
        if (direction.x > 0) facingDirection = 'right';
      }

      return {
        ...npc,
        position: { x: newX, y: newY },
        direction,
        moveTimer,
        frameCounter,
        frame,
        isMoving,
        facingDirection
      } as NpcInternalState;
    });

    npcsRef.current = next;
    setNpcs(next);
  };

  return {
    npcs,
    updateNpcPositions
  };
};



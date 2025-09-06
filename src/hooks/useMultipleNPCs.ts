import { useState, useEffect, useRef, useCallback } from 'react';
import { Position, MapRect, InteractionZone, GameLocation } from '../types';
import { gameConfig, getValidPosition, getRandomDirection, shouldNPCStop, isWithinProximity, calculateDistance } from '../utils';
import { useAudioSystem, AudioClip } from './useAudioSystem';

export interface NPCData {
  id: string;
  name: string;
  position: Position;
  frame: number;
  isMoving: boolean;
  direction: Position;
  moveTimer: number;
  frameCounter: number;
  facingDirection: 'left' | 'right';
  audioClip?: AudioClip;
  isTalking: boolean;
}

interface UseMultipleNPCsProps {
  mapRect: MapRect;
  playerPosition: Position;
  collisionZones?: InteractionZone[];
  currentLocation: GameLocation;
  npcConfigs: Array<{
    id: string;
    name: string;
    initialPosition?: Position;
    audioClip?: AudioClip;
  }>;
}

export const useMultipleNPCs = ({ 
  mapRect, 
  playerPosition, 
  collisionZones = [], 
  currentLocation,
  npcConfigs 
}: UseMultipleNPCsProps) => {
  const [npcs, setNpcs] = useState<NPCData[]>([]);
  const npcRefsMap = useRef<Map<string, {
    directionRef: React.MutableRefObject<Position>;
    moveTimerRef: React.MutableRefObject<number>;
    frameCounterRef: React.MutableRefObject<number>;
  }>>(new Map());
  
  const audioSystem = useAudioSystem();

  // Initialize NPCs when map is ready or configs change
  useEffect(() => {
    if (mapRect.width > 0 && mapRect.height > 0 && npcConfigs.length > 0) {
      const initializedNPCs: NPCData[] = npcConfigs.map((config, index) => {
        // Create refs for this NPC if they don't exist
        if (!npcRefsMap.current.has(config.id)) {
          npcRefsMap.current.set(config.id, {
            directionRef: { current: { x: 0, y: 0 } },
            moveTimerRef: { current: 0 },
            frameCounterRef: { current: 0 }
          });
        }

        // Calculate initial position - spread NPCs around the map
        const defaultPosition = config.initialPosition || {
          x: (mapRect.width * 0.2) + (index * 150) % (mapRect.width * 0.6),
          y: (mapRect.height * 0.3) + ((index % 2) * 200)
        };

        return {
          id: config.id,
          name: config.name,
          position: defaultPosition,
          frame: 0,
          isMoving: false,
          direction: { x: 0, y: 0 },
          moveTimer: 0,
          frameCounter: 0,
          facingDirection: 'right' as const,
          audioClip: config.audioClip,
          isTalking: false
        };
      });

      setNpcs(initializedNPCs);
    }
  }, [mapRect, npcConfigs]);

  // Use refs to avoid recreating the function on every render
  const playerPositionRef = useRef(playerPosition);
  const mapRectRef = useRef(mapRect);
  const collisionZonesRef = useRef(collisionZones);
  
  // Update refs when values change
  useEffect(() => {
    playerPositionRef.current = playerPosition;
  }, [playerPosition]);
  
  useEffect(() => {
    mapRectRef.current = mapRect;
  }, [mapRect]);
  
  useEffect(() => {
    collisionZonesRef.current = collisionZones;
  }, [collisionZones]);

  const updateNPCPositions = useCallback(() => {
    if (mapRectRef.current.width === 0 || mapRectRef.current.height === 0) {
      return;
    }

    setNpcs(prevNpcs => 
      prevNpcs.map(npc => {
        const npcRefs = npcRefsMap.current.get(npc.id);
        if (!npcRefs) return npc;

        const { directionRef, moveTimerRef, frameCounterRef } = npcRefs;
        
        let newX = npc.position.x;
        let newY = npc.position.y;
        let hasMovement = false;
        let newFacingDirection = npc.facingDirection;

        moveTimerRef.current++;

        // Check if player is nearby
        const isPlayerNearby = isWithinProximity(playerPositionRef.current, npc.position);
        
        // Don't move if talking or player is very close
        const shouldStop = npc.isTalking || isPlayerNearby;

        // Change direction every interval, but only if not talking and player not nearby
        if (!shouldStop && moveTimerRef.current % gameConfig.npcDirectionChangeInterval === 0) {
          if (shouldNPCStop()) {
            directionRef.current = { x: 0, y: 0 };
          } else {
            directionRef.current = getRandomDirection();
          }
        }

        // Move NPC based on current direction, but stop if talking or player nearby
        if (!shouldStop && (directionRef.current.x !== 0 || directionRef.current.y !== 0)) {
          newX = npc.position.x + directionRef.current.x * gameConfig.npcSpeed;
          newY = npc.position.y + directionRef.current.y * gameConfig.npcSpeed;
          hasMovement = true;

          // Update facing direction based on movement
          if (directionRef.current.x < 0) {
            newFacingDirection = 'left';
          } else if (directionRef.current.x > 0) {
            newFacingDirection = 'right';
          }
        }

        // Get valid position (constrained to map and avoiding collisions)
        const validPosition = getValidPosition(
          { x: newX, y: newY },
          npc.position,
          gameConfig.hedgehogSize,
          mapRectRef.current,
          collisionZonesRef.current
        );

        // Update animation frame
        let newFrame = npc.frame;
        if (hasMovement && !npc.isTalking) {
          frameCounterRef.current++;
          if (frameCounterRef.current % gameConfig.npcFrameUpdateInterval === 0) {
            newFrame = newFrame === 0 ? 1 : 0;
          }
        }

        return {
          ...npc,
          position: validPosition,
          frame: newFrame,
          isMoving: hasMovement && !npc.isTalking,
          facingDirection: newFacingDirection
        };
      })
    );
  }, []); // Empty dependency array since we use refs

  const handleNPCInteraction = useCallback((npcId: string) => {
    console.log(`🎯 handleNPCInteraction called for NPC: ${npcId}`);
    
    setNpcs(prev => {
      const npc = prev.find(n => n.id === npcId);
      if (!npc || !npc.audioClip) {
        console.log(`❌ NPC not found or no audio clip: ${npcId}`);
        return prev;
      }
      
      console.log(`✅ Found NPC: ${npc.name} with audio clip: ${npc.audioClip.name}`);

      // Check if player is close enough
      const distance = calculateDistance(playerPositionRef.current, npc.position);
      if (distance > gameConfig.proximityDistance) {
        console.log(`❌ Player too far: ${Math.round(distance)} > ${gameConfig.proximityDistance}`);
        return prev;
      }
      
      console.log(`✅ Player close enough: ${Math.round(distance)} <= ${gameConfig.proximityDistance}`);

      // If this NPC is already talking, stop
      if (npc.isTalking) {
        console.log(`🔇 NPC already talking, stopping audio`);
        audioSystem.stopAudio();
        return prev.map(n => 
          n.id === npcId ? { ...n, isTalking: false } : n
        );
      }

      // Stop any other talking NPCs and start this one
      console.log(`🎵 Starting audio for NPC: ${npc.name}`);
      audioSystem.stopAudio();
      
      // Play audio
      audioSystem.playAudio(npc.audioClip).then(() => {
        console.log(`✅ Audio finished naturally for ${npc.name}`);
        // Audio finished naturally
        setNpcs(current => current.map(n => 
          n.id === npcId ? { ...n, isTalking: false } : n
        ));
      }).catch((error) => {
        console.log(`❌ Audio failed for ${npc.name}:`, error);
        // Audio failed - NPC should stop talking
        setNpcs(current => current.map(n => 
          n.id === npcId ? { ...n, isTalking: false } : n
        ));
      });

      console.log(`🗣️ Setting NPC ${npc.name} to talking state`);
      return prev.map(n => 
        n.id === npcId ? { ...n, isTalking: true } : { ...n, isTalking: false }
      );
    });
  }, [audioSystem]); // Only depend on audioSystem

  const getNearbyNPC = useCallback((): NPCData | null => {
    // Use the current npcs state directly instead of setNpcs
    const currentNpcs = npcs;
    return currentNpcs.find(npc => {
      const distance = calculateDistance(playerPositionRef.current, npc.position);
      return distance <= gameConfig.proximityDistance;
    }) || null;
  }, [npcs]); // Depend on npcs but this is much less frequent than playerPosition

  const stopAllAudio = useCallback(() => {
    audioSystem.stopAudio();
    setNpcs(prev => prev.map(npc => ({ ...npc, isTalking: false })));
  }, [audioSystem]);

  // Simple distance check that runs every time - using setNpcs callback to avoid dependencies
  const lastCheckRef = useRef(0);
  const checkDistanceAndStopAudio = useCallback(() => {
    // Throttle to reduce console spam
    const now = Date.now();
    const shouldLog = now - lastCheckRef.current > 200; // Log every 200ms
    if (shouldLog) {
      lastCheckRef.current = now;
      console.log('🔍 checkDistanceAndStopAudio function called');
    }
    
    setNpcs(prev => {
      // Find talking NPC from current state
      const talkingNPC = prev.find(npc => npc.isTalking);
      const talkingCount = prev.filter(npc => npc.isTalking).length;
      
      if (shouldLog) {
        console.log(`📊 NPCs status: ${prev.length} total, ${talkingCount} talking`);
      }
      
      if (!talkingNPC) {
        if (shouldLog) console.log('❌ No talking NPC found');
        return prev; // No one is talking, no state change needed
      }
      
      if (shouldLog) {
        console.log(`🗣️ Found talking NPC: ${talkingNPC.name} at (${Math.round(talkingNPC.position.x)}, ${Math.round(talkingNPC.position.y)})`);
      }
      
      // Calculate distance
      const playerPos = playerPositionRef.current;
      const npcPos = talkingNPC.position;
      const distance = calculateDistance(playerPos, npcPos);
      const threshold = gameConfig.proximityDistance * 1.2; // 96 pixels
      
      if (shouldLog) {
        console.log(`🔍 Distance check: Player(${Math.round(playerPos.x)}, ${Math.round(playerPos.y)}) -> NPC(${Math.round(npcPos.x)}, ${Math.round(npcPos.y)}) = ${Math.round(distance)}px, threshold: ${threshold}px`);
      }
      
      // Stop audio if too far
      if (distance > threshold) {
        console.log(`🔇 STOPPING AUDIO: distance ${Math.round(distance)} > threshold ${threshold}`);
        audioSystem.stopAudio();
        return prev.map(npc => ({ ...npc, isTalking: false }));
      }
      
      return prev; // No change needed
    });
  }, [audioSystem]); // Only depend on audioSystem, not npcs

  return {
    npcs,
    updateNPCPositions,
    handleNPCInteraction,
    getNearbyNPC,
    stopAllAudio,
    checkDistanceAndStopAudio,
    audioSystem
  };
};

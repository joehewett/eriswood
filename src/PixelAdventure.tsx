import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GameLocation } from './types';
import { GameMap, Character, LoadingScreen, InteractionZones, BuildingInteractionPrompt, MultiplayerPlayers, ConnectionStatus, CharacterSelect, ProximityVisualization, MessageBoard, BookReviewInventory, NPCs, NPCInteractionPrompt } from './components';
import { 
  useFixedCanvasLayout,
  usePlayerMovement, 
  useNPCBehavior, 
  useGameLoop,
  useBuildingInteractions,
  useImageBounds,
  usePartyKitMultiplayer,
  useCenteredFixedCanvasLayout,
  useInteractionSystem,
  useMultipleNPCs
} from './hooks';
import { getInteractionZonesForLocation, convertRelativeZonesToCanvas } from './utils';

const PixelAdventure: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<GameLocation>(GameLocation.VILLAGE);
  const [selectedCharacter, setSelectedCharacter] = useState<'coro' | 'joe' | null>(null);
  const [showDebug, setShowDebug] = useState(true); // Enable debug mode by default
  const [isLoading, setIsLoading] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);


  
  // Custom hooks - use fixed canvas layout
  const mapRect = useCenteredFixedCanvasLayout();
  const imageBounds = useImageBounds(currentLocation);
  
  // Get collision zones in canvas coordinates for movement collision detection
  const canvasCollisionZones = convertRelativeZonesToCanvas(getInteractionZonesForLocation(currentLocation));
  
  const buildingInteractions = useBuildingInteractions({
    playerPosition: { x: 0, y: 0 }, // Will be updated by the movement hooks
    currentLocation,
    imageBounds: imageBounds.imageBounds
  });
  
  // Pass canvas collision zones to movement hooks
  const playerMovement = usePlayerMovement(mapRect, canvasCollisionZones);
  const npcBehavior = useNPCBehavior(mapRect, playerMovement.currentPositionRef.current, canvasCollisionZones);
  
  // Configure NPCs for the green grocer (shop) - memoized to prevent recreation
  const shopNPCConfigs = useMemo(() => [
    {
      id: 'grocer1',
      name: 'Martha',
      initialPosition: { x: 300, y: 200 },
      audioClip: { id: 'grocer1', src: '/music/alkharid.mp3', name: 'Martha\'s Greeting' }
    },
    {
      id: 'grocer2', 
      name: 'Bob',
      initialPosition: { x: 600, y: 300 },
      audioClip: { id: 'grocer2', src: '/music/bonedry.mp3', name: 'Bob\'s Story' }
    },
    {
      id: 'grocer3',
      name: 'Sarah',
      initialPosition: { x: 400, y: 450 },
      audioClip: { id: 'grocer3', src: '/music/dark.mp3', name: 'Sarah\'s Advice' }
    }
  ], []); // Empty dependency array since these configs never change
  
  // Multiple NPCs system (only active in shop)
  const multipleNPCs = useMultipleNPCs({
    mapRect,
    playerPosition: playerMovement.canvasPosition,
    collisionZones: canvasCollisionZones,
    currentLocation,
    npcConfigs: currentLocation === GameLocation.SHOP ? shopNPCConfigs : []
  });
  


  // Update building interactions with actual player position (use screen coordinates)
  const updatedBuildingInteractions = useBuildingInteractions({
    playerPosition: playerMovement.canvasPosition, // Canvas position for accurate detection
    currentLocation,
    imageBounds: imageBounds.imageBounds
  });

  // New interaction system
  const interactionSystem = useInteractionSystem({
    currentLocation,
    playerPosition: playerMovement.canvasPosition,
    onLocationChange: setCurrentLocation,
    setLoading: setIsLoading
  });

  // Multiplayer functionality - use canvas coordinates
  const multiplayer = usePartyKitMultiplayer({
    currentLocation,
    canvasPosition: playerMovement.currentPositionRef.current, // Canvas coordinates
    currentFrame: playerMovement.currentFrame,
    isMoving: playerMovement.isMoving,
    playerName: selectedCharacter ?? 'Player',
    fixedPlayerId: selectedCharacter ?? undefined,
    spriteVariant: selectedCharacter === 'joe' ? 1 : 0,
    facingDirection: playerMovement.facingDirection,
    mapRect: mapRect
  });



  // Auto-focus the game container to ensure keyboard events are captured
  useEffect(() => {
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  }, []);

  // Memoize game loop callbacks to prevent recreation
  const updateNPCPosition = useCallback(() => {
    // Update single NPC behavior (for other locations)
    if (currentLocation !== GameLocation.SHOP) {
      npcBehavior.updateNPCPosition();
    }
    // Update multiple NPCs (for shop)
    if (currentLocation === GameLocation.SHOP) {
      multipleNPCs.updateNPCPositions();
      // Also check distance for audio stopping in the game loop for better performance
      multipleNPCs.checkDistanceAndStopAudio();
    }
  }, [currentLocation, npcBehavior.updateNPCPosition, multipleNPCs.updateNPCPositions, multipleNPCs.checkDistanceAndStopAudio]);
  
  const handleInteraction = useCallback((onLocationChange: (location: GameLocation) => void) => {
    console.log(`🎮 X key pressed! Current location: ${currentLocation}`);
    
    // Handle NPC interactions in shop
    if (currentLocation === GameLocation.SHOP) {
      console.log(`🏪 In shop, looking for nearby NPCs...`);
      const nearbyNPC = multipleNPCs.getNearbyNPC();
      if (nearbyNPC) {
        console.log(`👋 Found nearby NPC: ${nearbyNPC.name}, calling handleNPCInteraction`);
        multipleNPCs.handleNPCInteraction(nearbyNPC.id);
        return;
      } else {
        console.log(`❌ No nearby NPC found in shop`);
      }
    }
    
    // Use new interaction system for building interactions
    if (updatedBuildingInteractions.currentInteractionZone?.interaction) {
      interactionSystem.executeInteraction(updatedBuildingInteractions.currentInteractionZone);
      return;
    }
  }, [currentLocation, multipleNPCs, updatedBuildingInteractions.currentInteractionZone, interactionSystem]);

  // Game loop
  useGameLoop({
    updatePlayerPosition: playerMovement.updatePosition,
    updateNPCPosition,
    handlePlayerKeyDown: playerMovement.handleKeyDown,
    handlePlayerKeyUp: playerMovement.handleKeyUp,
    handleInteraction,
    onLocationChange: setCurrentLocation,
    mapRect
  });

  return (
    <div 
      ref={gameContainerRef}
      className="w-screen h-screen relative overflow-hidden flex items-center justify-center outline-none"
      style={{ backgroundColor: '#041704' }}
      tabIndex={0}
    >
      {!selectedCharacter && (
        <CharacterSelect onSelect={(c) => setSelectedCharacter(c)} />
      )}
      <GameMap ref={imageBounds.imageRef} currentLocation={currentLocation} mapRect={mapRect} />
      
      {/* Debug: Show interaction zones */}
      <InteractionZones 
        zones={updatedBuildingInteractions.interactionZones} 
        mapRect={mapRect}
        showDebug={showDebug}
        playerPosition={playerMovement.position}
        proximityRadius={32}
      />
      
      {/* Proximity visualization */}
      <ProximityVisualization
        playerPosition={playerMovement.position}
        proximityRadius={32}
        characterSize={64}
        showDebug={showDebug}
      />

      {/* Current player */}
      <Character 
        position={playerMovement.position}
        currentFrame={playerMovement.currentFrame}
        alt="Player Hedgehog"
        facingDirection={playerMovement.facingDirection}
        showDebugBounds={showDebug}
      />

      {/* Other multiplayer players */}
      <MultiplayerPlayers 
        players={multiplayer.otherPlayers}
        showPlayerNames={true}
      />
      
      {/* NPCs - only show single NPC in non-shop locations */}
      {currentLocation !== GameLocation.SHOP && (
        <Character 
          position={npcBehavior.npcPosition}
          currentFrame={npcBehavior.npcFrame}
          alt="NPC Hedgehog"
          isNPC={true}
          showDebugBounds={showDebug}
        />
      )}
      
      {/* Multiple NPCs - only in shop */}
      {currentLocation === GameLocation.SHOP && (
        <NPCs 
          npcs={multipleNPCs.npcs}
          showDebugBounds={showDebug}
        />
      )}
      
      {/* NPC Interaction Prompt - only in shop */}
      {currentLocation === GameLocation.SHOP && (
        <NPCInteractionPrompt
          npc={multipleNPCs.getNearbyNPC()}
          show={!!multipleNPCs.getNearbyNPC()}
          mapRect={mapRect}
        />
      )}



      {/* Building interaction prompt */}
      <BuildingInteractionPrompt 
        zone={updatedBuildingInteractions.currentInteractionZone}
        show={updatedBuildingInteractions.showInteractionPrompt}
        mapRect={mapRect}
      />

      <LoadingScreen isLoading={isLoading} />
      
      {/* Connection status indicator */}
      <ConnectionStatus 
        isConnected={multiplayer.isConnected}
        isConnecting={multiplayer.isConnecting}
        error={multiplayer.error}
        playerCount={multiplayer.otherPlayers.length + 1} // +1 for current player
      />



      {/* Message Board for Book Room */}
      {currentLocation === GameLocation.BOOK_ROOM && (
        <MessageBoard
          currentPlayerId={multiplayer.currentPlayerId}
          currentPlayerName={selectedCharacter ?? 'Player'}
          mapRect={mapRect}
          triggerCreateModal={interactionSystem.isModalTriggered('diary-entry-create')}
          onModalTriggered={() => interactionSystem.clearModalTrigger('diary-entry-create')}
        />
      )}

      {/* Book Review Inventory Modal */}
      <BookReviewInventory
        isOpen={interactionSystem.isComponentVisible('book-reviews')}
        onClose={() => interactionSystem.handleComponentToggle('book-reviews', 'hide')}
        currentPlayerId={multiplayer.currentPlayerId}
        currentPlayerName={selectedCharacter ?? 'Player'}
      />

      {/* Debug Toggle Button */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-2 rounded text-sm font-mono z-50 hover:bg-gray-700"
      >
        Debug: {showDebug ? 'ON' : 'OFF'}
      </button>
    </div>
  );
};

export default PixelAdventure;

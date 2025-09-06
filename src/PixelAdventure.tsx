import React, { useState, useEffect, useRef } from 'react';
import { GameLocation } from './types';
import { GameMap, Character, LoadingScreen, InteractionZones, BuildingInteractionPrompt, MultiplayerPlayers, ConnectionStatus, CharacterSelect, ProximityVisualization, MessageBoard, BookReviewInventory, NpcAudioPlayer } from './components';
import { 
  useFixedCanvasLayout,
  usePlayerMovement, 
  useNPCBehavior, 
  useGameLoop,
  useBuildingInteractions,
  useImageBounds,
  usePartyKitMultiplayer,
  useCenteredFixedCanvasLayout,
  useInteractionSystem
} from './hooks';
import { getInteractionZonesForLocation, convertRelativeZonesToCanvas, canvasToScreenPosition } from './utils';

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
  // Precompute NPC zones for rendering and proximity (canvas coords)
  const npcZones = convertRelativeZonesToCanvas(getInteractionZonesForLocation(GameLocation.SHOP).filter(z => z.id.startsWith('npc-')));
  
  const buildingInteractions = useBuildingInteractions({
    playerPosition: { x: 0, y: 0 }, // Will be updated by the movement hooks
    currentLocation,
    imageBounds: imageBounds.imageBounds
  });
  
  // Pass canvas collision zones to movement hooks
  const playerMovement = usePlayerMovement(mapRect, canvasCollisionZones);
  const npcBehavior = useNPCBehavior(mapRect, playerMovement.currentPositionRef.current, canvasCollisionZones);
  


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

  // Game loop
  useGameLoop({
    updatePlayerPosition: playerMovement.updatePosition,
    updateNPCPosition: npcBehavior.updateNPCPosition,
    handlePlayerKeyDown: playerMovement.handleKeyDown,
    handlePlayerKeyUp: playerMovement.handleKeyUp,
    handleInteraction: (onLocationChange) => {
      // Use new interaction system for building interactions
      if (updatedBuildingInteractions.currentInteractionZone?.interaction) {
        interactionSystem.executeInteraction(updatedBuildingInteractions.currentInteractionZone);
        return;
      }
      

    },
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

      {/* NPCs inside the Shop */}
      {currentLocation === GameLocation.SHOP && npcZones.map((zone, idx) => (
        <Character
          key={zone.id}
          position={canvasToScreenPosition({ x: (zone.x ?? 0), y: (zone.y ?? 0) }, mapRect)}
          currentFrame={0}
          alt={zone.name}
          isNPC={true}
          spriteVariant={(idx % 3) + 1}
        />
      ))}

      {/* Other multiplayer players */}
      <MultiplayerPlayers 
        players={multiplayer.otherPlayers}
        showPlayerNames={true}
      />



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

      {/* NPC Audio Player (global, driven by component toggle) */}
      <NpcAudioPlayer
        isVisible={interactionSystem.isComponentVisible('npc-audio')}
        props={interactionSystem.getComponentProps('npc-audio')}
        playerCanvasPosition={playerMovement.canvasPosition}
        currentLocation={currentLocation}
        onHide={() => interactionSystem.handleComponentToggle('npc-audio', 'hide')}
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

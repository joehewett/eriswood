import { useState, useEffect, useRef, useCallback } from 'react';
import { MultiplayerPlayer, MultiplayerState, Position, GameLocation } from '../types';
import { PartyKitClient } from '../multiplayer/PartyKitClient';
import { canvasToScreenPosition, gameConfig } from '../utils';
import {
  PlayerUpdateMessage,
  HeartbeatMessage,
  ServerMessage,
  PlayerState,
} from '../multiplayer/types';

interface UsePartyKitMultiplayerProps {
  currentLocation: GameLocation;
  canvasPosition: Position; // Fixed-canvas coordinates (0..1600 × 0..900)
  currentFrame: number;
  isMoving: boolean;
  playerName?: string;
  fixedPlayerId?: 'coro' | 'joe';
  spriteVariant?: number;
  facingDirection?: 'left' | 'right';
  mapRect: { x: number; y: number; width: number; height: number };
}

export const usePartyKitMultiplayer = ({
  currentLocation,
  canvasPosition,
  currentFrame,
  isMoving,
  playerName = 'Anonymous',
  fixedPlayerId,
  spriteVariant = 0,
  facingDirection = 'right',
  mapRect,
}: UsePartyKitMultiplayerProps) => {
  const PLAYER_ID_STORAGE_KEY = 'pixel_player_id';

  const [multiplayerState, setMultiplayerState] = useState<MultiplayerState>({
    isConnected: false,
    isConnecting: true,
    otherPlayers: [],
    currentPlayerId: null,
    error: null,
  });

  const clientRef = useRef<PartyKitClient | null>(null);
  const currentPlayerIdRef = useRef<string | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const updateThrottleMs = 100;

  /* ---------------- Player-ID generation ---------------- */
  useEffect(() => {
    if (currentPlayerIdRef.current) return;

    if (fixedPlayerId) {
      currentPlayerIdRef.current = fixedPlayerId;
    } else {
      try {
        const existing = typeof window !== 'undefined' ? localStorage.getItem(PLAYER_ID_STORAGE_KEY) : null;
        if (existing) {
          currentPlayerIdRef.current = existing;
        } else {
          const newId = `player_${Math.random().toString(36).slice(2)}_${Date.now()}`;
          currentPlayerIdRef.current = newId;
          if (typeof window !== 'undefined') localStorage.setItem(PLAYER_ID_STORAGE_KEY, newId);
        }
      } catch {
        currentPlayerIdRef.current = `player_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      }
    }

    setMultiplayerState((prev) => ({ ...prev, currentPlayerId: currentPlayerIdRef.current }));
  }, [fixedPlayerId]);

  /* ---------------- Connection management ---------------- */
  useEffect(() => {
    if (!currentPlayerIdRef.current) return;

    // Disconnect previous client if any
    clientRef.current?.disconnect();

    setMultiplayerState((p) => ({ ...p, isConnecting: true, error: null }));

    const roomName = `location-${currentLocation}`;
    const client = new PartyKitClient({
      room: roomName,
      playerId: currentPlayerIdRef.current,
      host: 'localhost:1999',
    });

    client.addOpenListener(() => {
      setMultiplayerState((p) => ({ ...p, isConnected: true, isConnecting: false }));
      // Send initial state immediately
      sendPlayerUpdate(true);
    });

    client.addCloseListener(() => {
      setMultiplayerState((p) => ({ ...p, isConnected: false, isConnecting: false }));
    });

    // Handle messages
    client.addMessageListener((msg) => {
      switch (msg.type) {
        case 'player_list':
          handlePlayerList(msg.players);
          break;
        case 'player_joined':
        case 'player_updated':
          handlePlayerUpsert(msg.player);
          break;
        case 'player_left':
          setMultiplayerState((p) => ({
            ...p,
            otherPlayers: p.otherPlayers.filter((pl) => pl.playerId !== msg.playerId),
          }));
          break;
        case 'error':
          setMultiplayerState((p) => ({ ...p, error: msg.message }));
          break;
        default:
          console.warn('Unknown message', msg);
      }
    });

    client.connect();
    clientRef.current = client;

    return () => {
      client.disconnect();
      clientRef.current = null;
      setMultiplayerState((p) => ({ ...p, otherPlayers: [] }));
    };
  }, [currentLocation]);

  /* ---------------- Helper: update current player ---------------- */
  const sendPlayerUpdate = useCallback(
    (force = false) => {
      if (!clientRef.current || !currentPlayerIdRef.current) return;

      const now = Date.now();
      if (!force && now - lastUpdateRef.current < updateThrottleMs) return;
      lastUpdateRef.current = now;

      const message: PlayerUpdateMessage = {
        type: 'player_update',
        playerId: currentPlayerIdRef.current,
        playerName,
        position: canvasPosition,
        currentFrame,
        currentLocation,
        isMoving,
        spriteVariant,
        facingDirection,
      };

      clientRef.current.send(message);
    }, [canvasPosition.x, canvasPosition.y, currentFrame, isMoving, playerName, spriteVariant, facingDirection, currentLocation]);

  /* Send update when player moves */
  useEffect(() => {
    sendPlayerUpdate();
  }, [sendPlayerUpdate]);

  /* ---------------- Message handlers ---------------- */
  const handlePlayerList = useCallback(
    (players: PlayerState[]) => {
      const others = players
        .filter((p) => p.playerId !== currentPlayerIdRef.current)
        .map(convertToMultiplayerPlayer);
      setMultiplayerState((state) => ({ ...state, otherPlayers: others }));
    },
    [mapRect]
  );

  const handlePlayerUpsert = useCallback(
    (player: PlayerState) => {
      if (player.playerId === currentPlayerIdRef.current) return;
      const converted = convertToMultiplayerPlayer(player);
      setMultiplayerState((state) => {
        const existing = state.otherPlayers.some((p) => p.playerId === converted.playerId);
        return {
          ...state,
          otherPlayers: existing
            ? state.otherPlayers.map((p) => (p.playerId === converted.playerId ? converted : p))
            : [...state.otherPlayers, converted],
        };
      });
    },
    [mapRect]
  );

  /* ---------------- Conversion helper ---------------- */
  const convertToMultiplayerPlayer = (playerState: PlayerState): MultiplayerPlayer => {
    const screenPosition = mapRect.width > 0 ? canvasToScreenPosition(playerState.position, mapRect) : { x: 0, y: 0 };

    return {
      id: playerState.playerId,
      playerId: playerState.playerId,
      playerName: playerState.playerName,
      position: screenPosition,
      currentFrame: playerState.currentFrame,
      currentLocation: playerState.currentLocation,
      isMoving: playerState.isMoving,
      spriteVariant: playerState.spriteVariant,
      facingDirection: playerState.facingDirection,
      lastUpdate: new Date(playerState.lastUpdate).toISOString(),
    };
  };

  /* ---------------------------------------------------------------- */

  return {
    ...multiplayerState,
    updatePlayerPosition: () => sendPlayerUpdate(true),
  };
};

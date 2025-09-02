// Shared types for PartyKit server and client communication
export enum GameLocation {
  VILLAGE = 1,
  LIBRARY = 2,
  HOUSE_1 = 3,
  HOUSE_2 = 4,
  SHOP = 5,
  BLACKSMITH = 6,
}

export interface Position {
  x: number;
  y: number;
}

export interface PlayerState {
  playerId: string;
  playerName: string;
  position: Position;
  currentFrame: number;
  currentLocation: GameLocation;
  isMoving: boolean;
  spriteVariant: number;
  facingDirection: 'left' | 'right';
  lastUpdate: number;
  connectionId: string;
}

// Message types for client-server communication
export type ClientMessage = 
  | PlayerUpdateMessage
  | LocationChangeMessage
  | HeartbeatMessage;

export type ServerMessage = 
  | PlayerJoinedMessage
  | PlayerUpdatedMessage
  | PlayerLeftMessage
  | PlayerListMessage
  | ErrorMessage;

export interface PlayerUpdateMessage {
  type: 'player_update';
  playerId: string;
  playerName: string;
  position: Position;
  currentFrame: number;
  currentLocation: GameLocation;
  isMoving: boolean;
  spriteVariant: number;
  facingDirection: 'left' | 'right';
}

export interface LocationChangeMessage {
  type: 'location_change';
  playerId: string;
  newLocation: GameLocation;
}

export interface HeartbeatMessage {
  type: 'heartbeat';
  playerId: string;
}

export interface PlayerJoinedMessage {
  type: 'player_joined';
  player: PlayerState;
}

export interface PlayerUpdatedMessage {
  type: 'player_updated';
  player: PlayerState;
}

export interface PlayerLeftMessage {
  type: 'player_left';
  playerId: string;
}

export interface PlayerListMessage {
  type: 'player_list';
  players: PlayerState[];
}

export interface ErrorMessage {
  type: 'error';
  message: string;
}

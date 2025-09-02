import type * as Party from "partykit/server";
import { 
  ClientMessage, 
  ServerMessage, 
  PlayerState, 
  GameLocation,
  PlayerUpdateMessage,
  LocationChangeMessage,
  HeartbeatMessage,
} from "../src/multiplayer/types";

export default class PixelAdventureServer implements Party.Server {
  // Map of playerId -> PlayerState for this room/location
  private players = new Map<string, PlayerState>();
  
  // Connection ID to player ID mapping
  private connectionToPlayer = new Map<string, string>();
  
  // Heartbeat tracking
  private lastHeartbeat = new Map<string, number>();
  
  // Cleanup interval for stale players
  private cleanupInterval?: number;

  constructor(readonly room: Party.Room) {
    // Set up periodic cleanup of stale players (every 30 seconds)
    this.cleanupInterval = setInterval(() => {
      this.cleanupStalePlayers();
    }, 30000) as any;
  }

  onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(`Player connected: ${connection.id} to room ${this.room.id}`);
    
    // Send current player list to the newly connected player
    const currentPlayers = Array.from(this.players.values());
    const playerListMessage: ServerMessage = {
      type: 'player_list',
      players: currentPlayers
    };
    
    connection.send(JSON.stringify(playerListMessage));
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const parsedMessage: ClientMessage = JSON.parse(message);
      
      switch (parsedMessage.type) {
        case 'player_update':
          this.handlePlayerUpdate(parsedMessage, sender);
          break;
          
        case 'location_change':
          this.handleLocationChange(parsedMessage, sender);
          break;
          
        case 'heartbeat':
          this.handleHeartbeat(parsedMessage, sender);
          break;
          
        default:
          console.warn('Unknown message type:', parsedMessage);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      const errorMessage: ServerMessage = {
        type: 'error',
        message: 'Invalid message format'
      };
      sender.send(JSON.stringify(errorMessage));
    }
  }

  onClose(connection: Party.Connection) {
    console.log(`Player disconnected: ${connection.id}`);
    
    const playerId = this.connectionToPlayer.get(connection.id);
    if (playerId) {
      // Remove player from room
      this.players.delete(playerId);
      this.connectionToPlayer.delete(connection.id);
      this.lastHeartbeat.delete(playerId);
      
      // Notify other players
      const playerLeftMessage: ServerMessage = {
        type: 'player_left',
        playerId
      };
      
      this.room.broadcast(JSON.stringify(playerLeftMessage), [connection.id]);
    }
  }

  private handlePlayerUpdate(message: PlayerUpdateMessage, sender: Party.Connection) {
    const { playerId } = message;
    const now = Date.now();
    
    // Create or update player state
    const playerState: PlayerState = {
      playerId: message.playerId,
      playerName: message.playerName,
      position: message.position,
      currentFrame: message.currentFrame,
      currentLocation: message.currentLocation,
      isMoving: message.isMoving,
      spriteVariant: message.spriteVariant,
      facingDirection: message.facingDirection,
      lastUpdate: now,
      connectionId: sender.id
    };

    const isNewPlayer = !this.players.has(playerId);
    
    // Update player state
    this.players.set(playerId, playerState);
    this.connectionToPlayer.set(sender.id, playerId);
    this.lastHeartbeat.set(playerId, now);

    // Broadcast to other players
    const responseMessage: ServerMessage = isNewPlayer ? {
      type: 'player_joined',
      player: playerState
    } : {
      type: 'player_updated',
      player: playerState
    };

    this.room.broadcast(JSON.stringify(responseMessage), [sender.id]);
  }

  private handleLocationChange(message: LocationChangeMessage, sender: Party.Connection) {
    const { playerId, newLocation } = message;
    
    // Remove player from current room (they'll connect to new room)
    this.players.delete(playerId);
    this.connectionToPlayer.delete(sender.id);
    this.lastHeartbeat.delete(playerId);
    
    // Notify other players in this room that player left
    const playerLeftMessage: ServerMessage = {
      type: 'player_left',
      playerId
    };
    
    this.room.broadcast(JSON.stringify(playerLeftMessage), [sender.id]);
  }

  private handleHeartbeat(message: HeartbeatMessage, sender: Party.Connection) {
    const { playerId } = message;
    this.lastHeartbeat.set(playerId, Date.now());
  }

  private cleanupStalePlayers() {
    const now = Date.now();
    const staleThreshold = 60000; // 1 minute
    
    for (const [playerId, lastSeen] of this.lastHeartbeat.entries()) {
      if (now - lastSeen > staleThreshold) {
        console.log(`Cleaning up stale player: ${playerId}`);
        
        const player = this.players.get(playerId);
        if (player) {
          // Remove from all maps
          this.players.delete(playerId);
          this.connectionToPlayer.delete(player.connectionId);
          this.lastHeartbeat.delete(playerId);
          
          // Notify other players
          const playerLeftMessage: ServerMessage = {
            type: 'player_left',
            playerId
          };
          
          this.room.broadcast(JSON.stringify(playerLeftMessage));
        }
      }
    }
  }

  // Optional: Handle server shutdown
  onRequest(request: Party.Request) {
    // Health check endpoint
    if (request.method === "GET") {
      const playerCount = this.players.size;
      return new Response(JSON.stringify({ 
        room: this.room.id, 
        players: playerCount,
        status: 'healthy'
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response("Method not allowed", { status: 405 });
  }
}

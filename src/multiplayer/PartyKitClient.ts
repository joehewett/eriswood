import PartySocket from 'partysocket';

import {
  ClientMessage,
  ServerMessage,
  HeartbeatMessage,
} from './types';

export interface PartyKitClientOptions {
  /** Host for PartyKit – e.g. "localhost:1999" (without protocol) */
  host?: string;
  /** Room to join (usually location-derived) */
  room: string;
  /** Unique player identifier */
  playerId: string;
  /** Automatically reconnect on disconnect */
  autoReconnect?: boolean;
  /** Maximum reconnect attempts before giving up */
  maxReconnectAttempts?: number;
  /** Interval between heartbeats in milliseconds */
  heartbeatIntervalMs?: number;
}

type MessageListener = (msg: ServerMessage) => void;

type ConnectionStateListener = (socket: PartySocket | null) => void;

/**
 * PartyKitClient is a lightweight wrapper around `partysocket` that adds:
 *  – automatic heartbeat pings
 *  – exponential-backoff reconnection support
 *  – simple listener subscription helpers
 *
 *  NO React dependencies – can be used from any environment.
 */
export class PartyKitClient {
  private socket: PartySocket | null = null;
  private opts: Required<PartyKitClientOptions>;

  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;

  private messageListeners = new Set<MessageListener>();
  private openListeners = new Set<ConnectionStateListener>();
  private closeListeners = new Set<ConnectionStateListener>();

  constructor(options: PartyKitClientOptions) {
    // Fill defaults
    this.opts = {
      host: options.host ?? 'localhost:1999',
      heartbeatIntervalMs: options.heartbeatIntervalMs ?? 30_000,
      autoReconnect: options.autoReconnect ?? true,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 10,
      ...options,
    } as Required<PartyKitClientOptions>;
  }

  /* ---------------------------------------------------------------- *
   * Public API
   * ---------------------------------------------------------------- */

  /** Establishes the websocket connection */
  connect() {
    // If there is already an active socket, ignore
    if (this.socket && this.socket.readyState === PartySocket.OPEN) return;

    const { host, room, playerId } = this.opts;

    console.info(`🔄 Connecting to PartyKit: ws://${host} – room=${room}`);

    this.socket = new PartySocket({ host, room, id: playerId });

    // Wire up listeners
    this.socket.addEventListener('open', this.handleOpen as EventListener);
    this.socket.addEventListener('message', this.handleMessage as EventListener);
    this.socket.addEventListener('close', this.handleClose as EventListener);
    this.socket.addEventListener('error', this.handleError as EventListener);
  }

  /** Disconnect (and cancel auto-reconnect) */
  disconnect() {
    this.opts.autoReconnect = false;
    this.clearReconnectTimer();
    this.clearHeartbeat();
    this.socket?.close();
    this.socket = null;
  }

  /** Send a raw `ClientMessage` */
  send(message: ClientMessage) {
    if (!this.socket || this.socket.readyState !== PartySocket.OPEN) return;
    this.socket.send(JSON.stringify(message));
  }

  /** Convenience: send a heartbeat immediately */
  heartbeat() {
    if (!this.socket || this.socket.readyState !== PartySocket.OPEN) return;
    const heartbeat: HeartbeatMessage = {
      type: 'heartbeat',
      playerId: this.opts.playerId,
    };
    this.socket.send(JSON.stringify(heartbeat));
  }

  /** Subscribe to server messages */
  addMessageListener(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  /** Subscribe to connection open events */
  addOpenListener(listener: ConnectionStateListener): () => void {
    this.openListeners.add(listener);
    return () => this.openListeners.delete(listener);
  }

  /** Subscribe to connection close events */
  addCloseListener(listener: ConnectionStateListener): () => void {
    this.closeListeners.add(listener);
    return () => this.closeListeners.delete(listener);
  }

  /* ---------------------------------------------------------------- *
   * Internals
   * ---------------------------------------------------------------- */

  private handleOpen = () => {
    console.info('✅ PartyKit socket opened');
    // Reset reconnect attempts
    this.reconnectAttempts = 0;
    // Notify listeners
    this.openListeners.forEach((cb) => cb(this.socket));
    // Start heartbeat
    this.startHeartbeat();
  };

  private handleClose = () => {
    console.warn('❌ PartyKit socket closed');
    this.closeListeners.forEach((cb) => cb(this.socket));
    this.clearHeartbeat();

    if (this.opts.autoReconnect) {
      this.scheduleReconnect();
    }
  };

  private handleError = (e: Event | ErrorEvent) => {
    console.error('🚨 PartyKit socket error', e);
  };

  private handleMessage = (event: MessageEvent) => {
    try {
      const data: ServerMessage = JSON.parse(event.data);
      this.messageListeners.forEach((cb) => cb(data));
    } catch (err) {
      console.error('Failed to parse server message', err);
    }
  };

  /* ---------------- Reconnect logic ---------------- */

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.opts.maxReconnectAttempts) {
      console.error('🛑 Max reconnect attempts reached. Giving up.');
      return;
    }

    const backoff = Math.min(2 ** this.reconnectAttempts * 500, 15_000); // cap at 15s
    this.reconnectAttempts += 1;

    console.info(`↻ Reconnecting in ${backoff} ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, backoff);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /* ---------------- Heartbeat ---------------- */

  private startHeartbeat() {
    this.clearHeartbeat();
    this.heartbeat(); // send immediately
    this.heartbeatTimer = setInterval(() => {
      this.heartbeat();
    }, this.opts.heartbeatIntervalMs);
  }

  private clearHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

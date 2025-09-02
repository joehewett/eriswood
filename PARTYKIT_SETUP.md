# PartyKit Migration Setup

## Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration (kept for other features)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# PartyKit Configuration
VITE_PARTYKIT_HOST=localhost:1999

# For production, this would be:
# VITE_PARTYKIT_HOST=your-project.your-username.partykit.dev
```

## Development

### Running Both Servers

To run both the Vite dev server and PartyKit server simultaneously:

```bash
pnpm run dev:all
```

### Running Servers Separately

Run the Vite development server:
```bash
pnpm dev
```

Run the PartyKit server (in a separate terminal):
```bash
pnpm dev:party
```

## How It Works

1. **Room-based Architecture**: Each game location creates a separate PartyKit room (e.g., `location-1` for VILLAGE)
2. **Real-time Communication**: Players send position updates via WebSocket messages
3. **Automatic Reconnection**: PartySocket handles connection drops and reconnects automatically
4. **Location Changes**: When players move between locations, they automatically switch rooms
5. **Heartbeat System**: Keeps connections alive and cleans up stale players

## Message Protocol

The game uses a structured message protocol:

### Client → Server Messages
- `player_update`: Position and state updates
- `location_change`: When player moves to a new location
- `heartbeat`: Keep connection alive

### Server → Client Messages
- `player_list`: Initial list of players in the room
- `player_joined`: New player entered the room
- `player_updated`: Existing player's state changed
- `player_left`: Player disconnected
- `error`: Server error messages

## Migration Benefits

- ✅ **Faster real-time updates** (direct WebSocket vs database polling)
- ✅ **Simplified architecture** (no database management)
- ✅ **Better scalability** (PartyKit handles connection management)
- ✅ **Automatic reconnection** (built into PartySocket)
- ✅ **Room-based isolation** (players only see others in same location)

## Deployment

For production deployment, you'll need to:

1. Deploy the PartyKit server to PartyKit's platform
2. Update `VITE_PARTYKIT_HOST` to your production PartyKit URL
3. Build and deploy your frontend as usual

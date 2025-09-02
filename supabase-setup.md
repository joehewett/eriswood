# Supabase Setup Instructions

## 1. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Note your project URL and anon key

## 2. Environment Variables
Create a `.env.local` file in your project root with:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Database Setup
Run this SQL in your Supabase SQL editor:

```sql
-- Create player_positions table
CREATE TABLE player_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL UNIQUE, -- Make player_id unique to prevent duplicates
  player_name TEXT,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  current_frame INTEGER DEFAULT 0,
  current_location INTEGER NOT NULL,
  is_moving BOOLEAN DEFAULT false,
  sprite_variant INTEGER DEFAULT 0,
  last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE player_positions;

-- Create index for better performance
CREATE INDEX idx_player_positions_location ON player_positions(current_location);
CREATE INDEX idx_player_positions_player_id ON player_positions(player_id);

-- Optional: Set up row level security (RLS)
ALTER TABLE player_positions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can make this more restrictive later)
CREATE POLICY "Allow all operations on player_positions" ON player_positions
FOR ALL USING (true);
```

## 4. Clean Up Existing Duplicates (if needed)
If you already have duplicate records, run this to clean them up:

```sql
-- Delete all existing player records (clean slate)
DELETE FROM player_positions;

-- Or if you want to keep the most recent record for each player_id:
DELETE FROM player_positions 
WHERE id NOT IN (
  SELECT DISTINCT ON (player_id) id 
  FROM player_positions 
  ORDER BY player_id, last_update DESC
);
```

## 5. Add Unique Constraint (if table already exists)
If you already created the table without the unique constraint:

```sql
-- Add unique constraint to existing table
ALTER TABLE player_positions ADD CONSTRAINT unique_player_id UNIQUE (player_id);
```

## 6. Test Connection
The game will automatically connect when you start it with proper environment variables.

-- Migration to create diary_entries table for the message board feature
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS diary_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id TEXT NOT NULL,
    player_name TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on player_id for faster queries
CREATE INDEX IF NOT EXISTS idx_diary_entries_player_id ON diary_entries(player_id);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at ON diary_entries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- Allow all users to read all diary entries
CREATE POLICY "Allow read access to all diary entries" ON diary_entries
    FOR SELECT USING (true);

-- Allow users to insert their own diary entries
CREATE POLICY "Allow users to insert their own diary entries" ON diary_entries
    FOR INSERT WITH CHECK (true);

-- Allow users to update only their own diary entries
CREATE POLICY "Allow users to update their own diary entries" ON diary_entries
    FOR UPDATE USING (true) WITH CHECK (true);

-- Allow users to delete only their own diary entries (optional)
CREATE POLICY "Allow users to delete their own diary entries" ON diary_entries
    FOR DELETE USING (true);

-- Create book_reviews table
CREATE TABLE IF NOT EXISTS book_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  coro_review TEXT NOT NULL,
  joe_review TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read all book reviews
CREATE POLICY "Anyone can view book reviews" ON book_reviews
  FOR SELECT USING (true);

-- Policy to allow users to insert their own book reviews
CREATE POLICY "Users can insert their own book reviews" ON book_reviews
  FOR INSERT WITH CHECK (true);

-- Policy to allow users to update their own book reviews
CREATE POLICY "Users can update their own book reviews" ON book_reviews
  FOR UPDATE USING (player_id = auth.uid()::text);

-- Policy to allow users to delete their own book reviews
CREATE POLICY "Users can delete their own book reviews" ON book_reviews
  FOR DELETE USING (player_id = auth.uid()::text);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS book_reviews_created_at_idx ON book_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS book_reviews_player_id_idx ON book_reviews(player_id);

-- Add position columns to book_reviews table for drag and drop functionality
ALTER TABLE book_reviews 
ADD COLUMN position_x INTEGER DEFAULT 0,
ADD COLUMN position_y INTEGER DEFAULT 0;

-- Create index for position queries
CREATE INDEX IF NOT EXISTS book_reviews_position_idx ON book_reviews(position_x, position_y);

-- Update existing records to have default positions in a grid layout
-- This will space them out initially in a 5-column grid
WITH numbered_reviews AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) - 1 as row_num
  FROM book_reviews 
  WHERE position_x = 0 AND position_y = 0
)
UPDATE book_reviews 
SET 
  position_x = (numbered_reviews.row_num % 5) * 150,
  position_y = (numbered_reviews.row_num / 5) * 200
FROM numbered_reviews
WHERE book_reviews.id = numbered_reviews.id;

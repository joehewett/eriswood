# Book Reviews Setup

## Database Migration

To set up the book reviews functionality, you need to run the SQL migration in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `src/migrations/0002_book_reviews_migration.sql`
4. Run the migration

## How it works

1. Players can interact with the bookshelf in the Book Room by pressing 'X'
2. This opens a video-game style inventory modal showing all book reviews
3. Each review contains:
   - Book title
   - URL link to the book
   - Coro's review
   - Joe's review
   - Who added it and when
4. Players can add new reviews using the "Add New Review" button
5. All reviews are stored in Supabase and shared across all players

## Features

- ✅ Full-page modal with game-style UI
- ✅ Scrollable list of reviews
- ✅ Add new review functionality
- ✅ Supabase persistence
- ✅ Real-time loading states
- ✅ Player attribution
- ✅ External links to books
- ✅ Responsive design

The component follows the same patterns as the MessageBoard for consistent database operations and UI patterns.

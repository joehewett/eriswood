import React, { useState, useEffect } from 'react';
import { X, Plus, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BookReview {
  id: string;
  player_id: string;
  player_name: string;
  title: string;
  url: string;
  coro_review: string;
  joe_review: string;
  created_at: string;
  updated_at: string;
}

interface BookReviewInventoryProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayerId: string | null;
  currentPlayerName: string | null;
}



export const BookReviewInventory: React.FC<BookReviewInventoryProps> = ({
  isOpen,
  onClose,
  currentPlayerId,
  currentPlayerName
}) => {
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [selectedReview, setSelectedReview] = useState<BookReview | null>(null);
  const [newReview, setNewReview] = useState({
    title: '',
    url: '',
    coroReview: '',
    joeReview: ''
  });

  // Load reviews when component opens
  useEffect(() => {
    if (isOpen) {
      loadReviews();
    }
  }, [isOpen]);

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const { data, error } = await supabase
        .from('book_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading book reviews:', error);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error loading book reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleAddReview = async () => {
    if (!currentPlayerId || !currentPlayerName) return;
    
    if (newReview.title && newReview.url && newReview.coroReview && newReview.joeReview) {
      try {
        setIsLoading(true);
        
        const { error } = await supabase
          .from('book_reviews')
          .insert({
            player_id: currentPlayerId,
            player_name: currentPlayerName,
            title: newReview.title,
            url: newReview.url,
            coro_review: newReview.coroReview,
            joe_review: newReview.joeReview
          });

        if (error) {
          console.error('Error creating book review:', error);
          return;
        }

        // Reload reviews and reset form
        await loadReviews();
        setNewReview({ title: '', url: '', coroReview: '', joeReview: '' });
        setShowAddForm(false);
      } catch (error) {
        console.error('Error creating book review:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80"
        onClick={onClose}
      />
      
      {/* Main inventory modal */}
      <div 
        className="relative w-[90vw] h-[85vh] max-w-6xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/game/bookshelfempty.png)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200"
        >
          <X size={20} />
        </button>

        {/* Scrollable content area */}
        <div className="flex flex-col h-full p-6">
          {/* Add new review button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-none hover:bg-none text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200 shadow-lg hover:cursor-pointer"
            >
              <Plus size={20} />
              
            </button>
          </div>

          {/* Add review form */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg border-4 border-amber-600 mb-6 shadow-lg">
              <h3 className="text-xl font-bold text-amber-800 mb-4">Add New Book Review</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-800 font-semibold mb-2">Book Title</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full p-3 border-2 border-amber-300 rounded-lg focus:border-amber-500 outline-none"
                    placeholder="Enter book title..."
                  />
                </div>
                <div>
                  <label className="block text-amber-800 font-semibold mb-2">Book URL</label>
                  <input
                    type="url"
                    value={newReview.url}
                    onChange={(e) => setNewReview({ ...newReview, url: e.target.value })}
                    className="w-full p-3 border-2 border-amber-300 rounded-lg focus:border-amber-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-amber-800 font-semibold mb-2">Coro's Review</label>
                  <textarea
                    value={newReview.coroReview}
                    onChange={(e) => setNewReview({ ...newReview, coroReview: e.target.value })}
                    className="w-full p-3 border-2 border-amber-300 rounded-lg focus:border-amber-500 outline-none h-24 resize-none"
                    placeholder="Coro's thoughts on the book..."
                  />
                </div>
                <div>
                  <label className="block text-amber-800 font-semibold mb-2">Joe's Review</label>
                  <textarea
                    value={newReview.joeReview}
                    onChange={(e) => setNewReview({ ...newReview, joeReview: e.target.value })}
                    className="w-full p-3 border-2 border-amber-300 rounded-lg focus:border-amber-500 outline-none h-24 resize-none"
                    placeholder="Joe's thoughts on the book..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddReview}
                  disabled={isLoading || !currentPlayerId}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  {isLoading ? 'Saving...' : 'Save Review'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewReview({ title: '', url: '', coroReview: '', joeReview: '' });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Book Images Grid */}
          <div className="flex-1 overflow-y-auto">
            {loadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-amber-700 text-lg font-semibold">Loading book reviews...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    onClick={() => setSelectedReview(review)}
                  >
                    {/* Book Image */}
                    <img
                      src={`/game/book1.png`}
                      alt={review.title}
                      className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                    />
                    
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-sm font-semibold truncate">{review.title}</p>
                      <p className="text-xs text-gray-300">by {review.player_name}</p>
                    </div>
                  </div>
                ))}
                
                {reviews.length === 0 && !loadingReviews && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-amber-700 text-lg font-semibold">No book reviews yet!</p>
                    <p className="text-amber-600">Click "Add New Review" to get started.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Review Detail Modal */}
      {selectedReview && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-60"
            onClick={() => setSelectedReview(null)}
          />
          <div className="relative bg-white p-6 rounded-lg border-4 border-amber-600 shadow-2xl max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-amber-900 hover:bg-amber-950 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X size={20} />
            </button>

            {/* Book title and link */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-amber-800 mb-2 flex items-center gap-2">
                {selectedReview.title}
                <a
                  href={selectedReview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <ExternalLink size={20} />
                </a>
              </h3>
              <p className="text-sm text-gray-600">
                Added by {selectedReview.player_name} on {new Date(selectedReview.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                  🎭 Coro's Review
                </h4>
                <p className="text-purple-700 text-sm leading-relaxed">{selectedReview.coro_review}</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  🧑‍💻 Joe's Review
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed">{selectedReview.joe_review}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

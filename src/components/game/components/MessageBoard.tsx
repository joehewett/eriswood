import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DiaryEntry, DiaryEntryData } from './DiaryEntry';
import { DiaryEntryModal } from './DiaryEntryModal';
import { MapRect } from '../types';

interface MessageBoardProps {
  currentPlayerId: string | null;
  currentPlayerName: string | null;
  mapRect: MapRect;
  onCreateClick?: () => void;
  triggerCreateModal?: boolean;
  onModalTriggered?: () => void;
}

export const MessageBoard: React.FC<MessageBoardProps> = ({
  currentPlayerId,
  currentPlayerName,
  mapRect,
  triggerCreateModal,
  onModalTriggered
}) => {
  const [entries, setEntries] = useState<DiaryEntryData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // Load diary entries on component mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Handle direct modal trigger from parent
  useEffect(() => {
    if (triggerCreateModal) {
      setEditingEntry(null);
      setIsModalOpen(true);
      onModalTriggered?.();
    }
  }, [triggerCreateModal, onModalTriggered]);

  const loadEntries = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoadingEntries(true);
      }
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading diary entries:', error);
        return;
      }

      setEntries(data || []);
      
      // Update editingEntry if it exists and modal is open
      if (editingEntry && isModalOpen) {
        const updatedEntry = data?.find(entry => entry.id === editingEntry.id);
        if (updatedEntry) {
          setEditingEntry(updatedEntry);
        }
      }
    } catch (error) {
      console.error('Error loading diary entries:', error);
    } finally {
      if (showLoading) {
        setLoadingEntries(false);
      }
    }
  };

  const handleEditEntry = (entry: DiaryEntryData) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleSubmitEntry = async (data: { title: string; content: string }) => {
    if (!currentPlayerId) return;

    try {
      setIsLoading(true);

      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('diary_entries')
          .update({
            title: data.title,
            content: data.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEntry.id)
          .eq('player_id', currentPlayerId); // Ensure user can only edit their own entries

        if (error) {
          console.error('Error updating diary entry:', error);
          return;
        }
      } else {
        // Create new entry
        const { error } = await supabase
          .from('diary_entries')
          .insert({
            player_id: currentPlayerId,
            player_name: currentPlayerName,
            title: data.title,
            content: data.content
          });

        if (error) {
          console.error('Error creating diary entry:', error);
          return;
        }
      }

      // Reload entries to get updated data
      await loadEntries();
    } catch (error) {
      console.error('Error submitting diary entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEntryPosition = (index: number) => {
    const cardWidth = 140; // Card width
    const cardHeight = 100; // Card height
    const gap = 12; // Gap between cards
    const startX = 20; // Start from top left with small margin
    const startY = 20; // Start from top with small margin
    const marginRight = 20; // Right margin to match left
    
    // Calculate how many columns can fit in the available width
    const availableWidth = mapRect.width - startX - marginRight;
    const cols = Math.floor((availableWidth + gap) / (cardWidth + gap));
    
    // Ensure at least 1 column
    const actualCols = Math.max(1, cols);
    
    const row = Math.floor(index / actualCols);
    const col = index % actualCols;
    
    return {
      x: startX + col * (cardWidth + gap),
      y: startY + row * (cardHeight + gap),
      width: cardWidth,
      height: cardHeight
    };
  };

  // Create button position (top center)
  const createButtonPosition = {
    x: mapRect.width / 2 - 120,
    y: 40
  };

  if (loadingEntries) {
    return (
      <div
        className="absolute flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-mono"
        style={{
          left: `${mapRect.width / 2 - 100}px`,
          top: `${mapRect.height / 2 - 25}px`,
          width: '200px',
          height: '50px',
          zIndex: 1
        }}
      >
        Loading entries...
      </div>
    );
  }

  return (
    <>

      {/* Diary entries */}
      {entries.map((entry, index) => {
        const position = getEntryPosition(index);
        return (
          <DiaryEntry
            key={entry.id}
            entry={entry}
            onEdit={handleEditEntry}
            canEdit={entry.player_id === currentPlayerId}
            position={position}
            size={{ width: position.width, height: position.height }}
          />
        );
      })}

      {/* No entries message */}
      {entries.length === 0 && !loadingEntries && (
        <div
          className="absolute flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-2xl p-8 text-amber-900 shadow-2xl"
          style={{
            left: `${mapRect.width / 2 - 200}px`,
            top: `${mapRect.height / 2 - 80}px`,
            width: '400px',
            height: '160px',
            zIndex: 1,
            fontFamily: 'serif'
          }}
        >
          <div className="text-2xl font-bold mb-3 text-amber-800">📖 Welcome to the Message Board!</div>
          <div className="text-base text-center leading-relaxed text-amber-700">
            No diary entries yet. Be the first to share your thoughts and experiences!
          </div>
          <div className="mt-3 text-sm text-amber-600 italic">Press X near the board to create an entry</div>
        </div>
      )}

      {/* Modal for creating/editing entries */}
      <DiaryEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitEntry}
        editingEntry={editingEntry}
        isLoading={isLoading}
        currentPlayerId={currentPlayerId}
        currentPlayerName={currentPlayerName}
        onAutoSave={() => loadEntries(false)}
      />
    </>
  );
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DiaryEntryData } from './DiaryEntry';
import { supabase } from '../lib/supabase';

interface DiaryEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  editingEntry?: DiaryEntryData | null;
  isLoading?: boolean;
  currentPlayerId?: string | null;
  currentPlayerName?: string | null;
  onAutoSave?: () => void;
}

export const DiaryEntryModal: React.FC<DiaryEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingEntry,
  isLoading = false,
  currentPlayerId,
  currentPlayerName,
  onAutoSave
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [draftEntryId, setDraftEntryId] = useState<string | null>(null);

  // Reset form when modal opens/closes or editing entry changes
  useEffect(() => {
    if (isOpen) {
      if (editingEntry) {
        setTitle(editingEntry.title);
        setContent(editingEntry.content);
        setDraftEntryId(editingEntry.id);
      } else {
        setTitle('');
        setContent('');
        setDraftEntryId(null);
      }
      setPreview(false);
      setAutoSaveStatus('idle');
    }
  }, [isOpen, editingEntry]);

  // Update form content when editingEntry changes (due to auto-save refreshes)
  useEffect(() => {
    if (isOpen && editingEntry && autoSaveStatus === 'saved') {
      // Only update if we just finished an auto-save to prevent overwriting user input
      setTitle(editingEntry.title);
      setContent(editingEntry.content);
    }
  }, [editingEntry?.updated_at, isOpen, autoSaveStatus]);

  // Auto-save functionality
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performAutoSave = useCallback(async (titleValue: string, contentValue: string) => {
    if (!currentPlayerId || (!titleValue.trim() && !contentValue.trim())) {
      return;
    }

    setAutoSaveStatus('saving');

    try {
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('diary_entries')
          .update({
            title: titleValue || 'Untitled',
            content: contentValue,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEntry.id)
          .eq('player_id', currentPlayerId);

        if (error) throw error;
      } else {
        // Create or update draft entry
        if (draftEntryId) {
          // Update existing draft
          const { error } = await supabase
            .from('diary_entries')
            .update({
              title: titleValue || 'Untitled',
              content: contentValue,
              updated_at: new Date().toISOString()
            })
            .eq('id', draftEntryId)
            .eq('player_id', currentPlayerId);

          if (error) throw error;
        } else {
          // Create new draft entry
          const { data, error } = await supabase
            .from('diary_entries')
            .insert({
              player_id: currentPlayerId,
              player_name: currentPlayerName,
              title: titleValue || 'Untitled',
              content: contentValue
            })
            .select('id')
            .single();

          if (error) throw error;
          if (data) {
            setDraftEntryId(data.id);
          }
        }
      }

      setAutoSaveStatus('saved');
      
      // Notify parent component to refresh entries
      onAutoSave?.();
      
      // Reset to idle after 2 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('error');
      
      // Reset to idle after 3 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  }, [currentPlayerId, currentPlayerName, editingEntry, draftEntryId]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!isOpen) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (3 seconds after user stops typing)
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave(title, content);
    }, 3000);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, content, isOpen, performAutoSave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
      onClose();
    } catch (error) {
      console.error('Error submitting diary entry:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Simple markdown renderer for preview
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 rounded-2xl shadow-2xl max-w-4xl w-full mx-6 max-h-[85vh] overflow-hidden" style={{ fontFamily: 'serif' }}>
        {/* Decorative top border matching diary cards */}
        <div className="w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400"></div>
        
        <div className="flex justify-between items-center p-4 border-b border-amber-200">
          <h2 className="text-xl font-bold text-amber-900 flex items-center space-x-2">
            <span>📖</span>
            <span>{editingEntry ? 'Edit Entry' : 'New Entry'}</span>
          </h2>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-3 py-1.5 rounded-lg font-mono font-bold shadow-lg transition-all duration-200"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-amber-900 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white bg-opacity-80 text-amber-900 font-medium placeholder-amber-400"
                placeholder="Enter title..."
                maxLength={100}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <label htmlFor="content" className="block text-sm font-medium text-amber-900">
                  Content
                </label>
                {autoSaveStatus !== 'idle' && (
                  <div className="flex items-center space-x-1 text-xs">
                    {autoSaveStatus === 'saving' && (
                      <>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-blue-600">Saving...</span>
                      </>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">Saved</span>
                      </>
                    )}
                    {autoSaveStatus === 'error' && (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-600">Save failed</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1 rounded text-sm font-medium shadow-md transition-all duration-200"
                disabled={isLoading}
              >
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {preview ? (
              <div 
                className="w-full h-[500px] p-4 border-2 border-amber-200 rounded-xl bg-gradient-to-br from-white to-amber-50 prose prose-lg max-w-none text-amber-800 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            ) : (
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[500px] px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white bg-opacity-80 text-amber-900 text-base leading-relaxed placeholder-amber-400 resize-none"
                placeholder="Write your diary entry here..."
                required
                disabled={isLoading}
              />
            )}
          </div>

          <div className="flex justify-end space-x-3 p-4 border-t border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-amber-700 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 disabled:opacity-50 font-medium shadow-md transition-all duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-lg disabled:opacity-50 font-semibold shadow-lg transition-all duration-200"
              disabled={isLoading || !title.trim() || !content.trim()}
            >
              {isLoading ? 'Saving...' : editingEntry ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

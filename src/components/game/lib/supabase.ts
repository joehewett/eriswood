import { createClient } from '@supabase/supabase-js'

// These will be your actual Supabase project credentials
// For now, using placeholder values - you'll need to replace these
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // Limit events for performance
    },
  },
})

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      player_positions: {
        Row: {
          id: string
          player_id: string
          player_name: string | null
          x: number
          y: number
          current_frame: number
          current_location: number
          is_moving: boolean
          sprite_variant: number
          last_update: string
        }
        Insert: {
          id?: string
          player_id: string
          player_name?: string | null
          x: number
          y: number
          current_frame?: number
          current_location: number
          is_moving?: boolean
          sprite_variant?: number
          last_update?: string
        }
        Update: {
          id?: string
          player_id?: string
          player_name?: string | null
          x?: number
          y?: number
          current_frame?: number
          current_location?: number
          is_moving?: boolean
          sprite_variant?: number
          last_update?: string
        }
      }
      diary_entries: {
        Row: {
          id: string
          player_id: string
          player_name: string | null
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          player_name?: string | null
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          player_name?: string | null
          title?: string
          content?: string
          updated_at?: string
        }
      }
    }
  }
}

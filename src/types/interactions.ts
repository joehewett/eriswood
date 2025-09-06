import { GameLocation, InteractionZone } from '../types';

// Define different types of interactions
export enum InteractionType {
  NAVIGATION = 'navigation',      // Navigate to different location
  MODAL = 'modal',               // Show a modal/dialog
  COMPONENT = 'component',       // Show/toggle a component
  CUSTOM = 'custom'              // Custom handler function
}

// Base interface for interaction data
export interface BaseInteractionData {
  type: InteractionType;
}

// Navigation interaction - moves player to different location
export interface NavigationInteractionData extends BaseInteractionData {
  type: InteractionType.NAVIGATION;
  targetLocation: GameLocation;
  loadingDuration?: number;
}

// Modal interaction - shows a modal dialog
export interface ModalInteractionData extends BaseInteractionData {
  type: InteractionType.MODAL;
  modalId: string;
  modalProps?: Record<string, any>;
}

// Component interaction - shows/toggles a component
export interface ComponentInteractionData extends BaseInteractionData {
  type: InteractionType.COMPONENT;
  componentId: string;
  componentProps?: Record<string, any>;
  action?: 'show' | 'hide' | 'toggle';
}

// Custom interaction - uses a custom handler function
export interface CustomInteractionData extends BaseInteractionData {
  type: InteractionType.CUSTOM;
  handlerId: string;
  customData?: Record<string, any>;
}

// Union type for all interaction data
export type InteractionData = 
  | NavigationInteractionData 
  | ModalInteractionData 
  | ComponentInteractionData 
  | CustomInteractionData;

// Handler function type for custom interactions
export type InteractionHandler = (
  data: InteractionData,
  context: InteractionContext
) => void | Promise<void>;

// Context passed to interaction handlers
export interface InteractionContext {
  currentLocation: GameLocation;
  playerPosition: { x: number; y: number };
  onLocationChange: (location: GameLocation) => void;
  onModalTrigger: (modalId: string, props?: Record<string, any>) => void;
  onComponentToggle: (componentId: string, action?: 'show' | 'hide' | 'toggle', props?: Record<string, any>) => void;
  setLoading: (loading: boolean) => void;
  // Zone that triggered this interaction (if applicable)
  triggeringZone?: InteractionZone;
}

// Registry for interaction handlers
export interface InteractionHandlerRegistry {
  [handlerId: string]: InteractionHandler;
}

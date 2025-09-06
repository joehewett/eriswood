import { 
  InteractionData, 
  InteractionHandler, 
  InteractionHandlerRegistry, 
  InteractionContext,
  InteractionType,
  NavigationInteractionData,
  ModalInteractionData,
  ComponentInteractionData,
  CustomInteractionData
} from '../types/interactions';
import { GameLocation } from '../types';
import { getLocationImageSrc, gameConfig, getInteractionZoneCenter } from '../utils';

export class InteractionSystem {
  private handlers: InteractionHandlerRegistry = {};

  constructor() {
    // Register built-in handlers
    this.registerBuiltInHandlers();
  }

  // Register a custom interaction handler
  registerHandler(handlerId: string, handler: InteractionHandler): void {
    this.handlers[handlerId] = handler;
  }

  // Execute an interaction
  async executeInteraction(data: InteractionData, context: InteractionContext): Promise<void> {
    switch (data.type) {
      case InteractionType.NAVIGATION:
        await this.handleNavigation(data as NavigationInteractionData, context);
        break;
      
      case InteractionType.MODAL:
        this.handleModal(data as ModalInteractionData, context);
        break;
      
      case InteractionType.COMPONENT:
        this.handleComponent(data as ComponentInteractionData, context);
        break;
      
      case InteractionType.CUSTOM:
        await this.handleCustom(data as CustomInteractionData, context);
        break;
      
      default:
        console.warn('Unknown interaction type:', (data as any).type);
    }
  }

  // Built-in navigation handler
  private async handleNavigation(data: NavigationInteractionData, context: InteractionContext): Promise<void> {
    context.setLoading(true);
    
    // Preload the target location image
    const img = new Image();
    img.src = getLocationImageSrc(data.targetLocation);
    
    // Wait for both the loading duration and image to load
    const loadingDuration = data.loadingDuration ?? gameConfig.loadingDuration;
    const loadingTimer = new Promise(resolve => 
      setTimeout(resolve, loadingDuration)
    );
    
    const imageLoader = new Promise(resolve => {
      if (img.complete) {
        resolve(true);
      } else {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true); // Continue even if image fails to load
      }
    });
    
    await Promise.all([loadingTimer, imageLoader]);
    context.onLocationChange(data.targetLocation);
    context.setLoading(false);
  }

  // Built-in modal handler
  private handleModal(data: ModalInteractionData, context: InteractionContext): void {
    context.onModalTrigger(data.modalId, data.modalProps);
  }

  // Built-in component handler
  private handleComponent(data: ComponentInteractionData, context: InteractionContext): void {
    const action = data.action ?? 'toggle';
    context.onComponentToggle(data.componentId, action, data.componentProps);
  }

  // Custom handler dispatcher
  private async handleCustom(data: CustomInteractionData, context: InteractionContext): Promise<void> {
    const handler = this.handlers[data.handlerId];
    if (!handler) {
      console.warn(`No handler registered for custom interaction: ${data.handlerId}`);
      return;
    }
    
    await handler(data, context);
  }

  // Register built-in handlers for common interactions
  private registerBuiltInHandlers(): void {
    // Example: Book review handler
    this.registerHandler('book-review', async (data, context) => {
      // This would show a book review component
      const customData = (data as CustomInteractionData).customData;
      context.onComponentToggle('book-review', 'show', customData);
    });

    // Example: Recipe handler
    this.registerHandler('recipe', async (data, context) => {
      // This would show a recipe component
      const customData = (data as CustomInteractionData).customData;
      context.onComponentToggle('recipe', 'show', customData);
    });

    // Example: Diary entry handler (for backwards compatibility)
    this.registerHandler('diary-entry', async (data, context) => {
      const customData = (data as CustomInteractionData).customData;
      context.onModalTrigger('diary-entry-create', customData);
    });

    // NPC audio handler: show an audio component tied to a specific NPC id
    this.registerHandler('npc-audio', async (data, context) => {
      const customData = (data as CustomInteractionData).customData || {};
      const npcCanvasPosition = context.triggeringZone ? getInteractionZoneCenter(context.triggeringZone) : undefined;
      // Expected customData: { npcId: string, audioSrc: string, displayName?: string }
      context.onComponentToggle('npc-audio', 'show', {
        ...customData,
        location: context.currentLocation,
        npcCanvasPosition
      });
    });
  }
}

// Singleton instance
export const interactionSystem = new InteractionSystem();

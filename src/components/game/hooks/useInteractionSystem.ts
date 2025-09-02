import { useState, useCallback } from 'react';
import { GameLocation } from '../types';
import { InteractionContext } from '../types/interactions';
import { interactionSystem } from '../systems/InteractionSystem';

interface UseInteractionSystemProps {
  currentLocation: GameLocation;
  playerPosition: { x: number; y: number };
  onLocationChange: (location: GameLocation) => void;
  setLoading: (loading: boolean) => void;
}

export const useInteractionSystem = ({
  currentLocation,
  playerPosition,
  onLocationChange,
  setLoading
}: UseInteractionSystemProps) => {
  const [modalTriggers, setModalTriggers] = useState<Record<string, any>>({});
  const [componentStates, setComponentStates] = useState<Record<string, { visible: boolean; props?: any }>>({});

  const handleModalTrigger = useCallback((modalId: string, props?: Record<string, any>) => {
    setModalTriggers(prev => ({
      ...prev,
      [modalId]: { triggered: true, props }
    }));
  }, []);

  const clearModalTrigger = useCallback((modalId: string) => {
    setModalTriggers(prev => {
      const newTriggers = { ...prev };
      delete newTriggers[modalId];
      return newTriggers;
    });
  }, []);

  const handleComponentToggle = useCallback((
    componentId: string, 
    action: 'show' | 'hide' | 'toggle' = 'toggle', 
    props?: Record<string, any>
  ) => {
    setComponentStates(prev => {
      const current = prev[componentId] || { visible: false };
      let newVisible = current.visible;
      
      switch (action) {
        case 'show':
          newVisible = true;
          break;
        case 'hide':
          newVisible = false;
          break;
        case 'toggle':
          newVisible = !current.visible;
          break;
      }
      
      return {
        ...prev,
        [componentId]: {
          visible: newVisible,
          props: props || current.props
        }
      };
    });
  }, []);

  const executeInteraction = useCallback(async (interactionZone: any) => {
    if (!interactionZone?.interaction) {
      console.warn('No interaction data found for zone:', interactionZone);
      return;
    }

    const context: InteractionContext = {
      currentLocation,
      playerPosition,
      onLocationChange,
      onModalTrigger: handleModalTrigger,
      onComponentToggle: handleComponentToggle,
      setLoading
    };

    await interactionSystem.executeInteraction(interactionZone.interaction, context);
  }, [currentLocation, playerPosition, onLocationChange, setLoading, handleModalTrigger, handleComponentToggle]);

  return {
    executeInteraction,
    modalTriggers,
    clearModalTrigger,
    componentStates,
    handleComponentToggle,
    // Backwards compatibility helpers
    isModalTriggered: (modalId: string) => !!modalTriggers[modalId]?.triggered,
    getModalProps: (modalId: string) => modalTriggers[modalId]?.props,
    isComponentVisible: (componentId: string) => !!componentStates[componentId]?.visible,
    getComponentProps: (componentId: string) => componentStates[componentId]?.props
  };
};

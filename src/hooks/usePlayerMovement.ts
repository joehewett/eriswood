import { useState, useEffect, useRef } from 'react';
import { Position, MapRect, InteractionZone } from '../types';
import { gameConfig, getFixedCanvasCenteredPosition, canvasToScreenPosition, getValidPosition } from '../utils';

export const usePlayerMovement = (mapRect: MapRect, collisionZones: InteractionZone[] = []) => {
  // Store position in canvas coordinates (0,0 to FIXED_CANVAS_WIDTH,FIXED_CANVAS_HEIGHT)
  const [canvasPosition, setCanvasPosition] = useState<Position>({ x: 0, y: 0 });
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [facingDirection, setFacingDirection] = useState<'left' | 'right'>('right');
  
  const keysPressed = useRef<Set<string>>(new Set());
  const frameCounterRef = useRef(0);
  const currentCanvasPositionRef = useRef<Position>({ x: 0, y: 0 });

  // Initialize player at center of canvas
  useEffect(() => {
    const centeredCanvasPosition = getFixedCanvasCenteredPosition(gameConfig.hedgehogSize);
    setCanvasPosition(centeredCanvasPosition);
    currentCanvasPositionRef.current = centeredCanvasPosition;
  }, []);

  // Convert canvas position to screen position for rendering
  const screenPosition = mapRect.width > 0 ? canvasToScreenPosition(canvasPosition, mapRect) : { x: 0, y: 0 };

  const updatePosition = () => {
    setCanvasPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      let hasMovement = false;

      if (keysPressed.current.has('ArrowUp')) {
        newY = prev.y - gameConfig.moveSpeed;
        hasMovement = true;
      }
      if (keysPressed.current.has('ArrowDown')) {
        newY = prev.y + gameConfig.moveSpeed;
        hasMovement = true;
      }
      if (keysPressed.current.has('ArrowLeft')) {
        newX = prev.x - gameConfig.moveSpeed;
        hasMovement = true;
        setFacingDirection('left');
      }
      if (keysPressed.current.has('ArrowRight')) {
        newX = prev.x + gameConfig.moveSpeed;
        hasMovement = true;
        setFacingDirection('right');
      }

      // Calculate intended new position
      const intendedPosition = { x: newX, y: newY };
      
      // Create a fake mapRect for canvas coordinates (since we're working in canvas space)
      const canvasMapRect = {
        x: 0,
        y: 0,
        width: gameConfig.FIXED_CANVAS_WIDTH,
        height: gameConfig.FIXED_CANVAS_HEIGHT
      };

      // Use getValidPosition to handle both map boundaries and collision detection
      const validPosition = getValidPosition(
        intendedPosition,
        prev,
        gameConfig.hedgehogSize,
        canvasMapRect,
        collisionZones
      );

      // Update movement state and animation frame
      setIsMoving(hasMovement);
      
      if (hasMovement) {
        frameCounterRef.current++;
        if (frameCounterRef.current % gameConfig.frameUpdateInterval === 0) {
          setCurrentFrame(prev => prev === 0 ? 1 : 0);
        }
      }

      // Update position ref with canvas coordinates
      currentCanvasPositionRef.current = validPosition;
      return validPosition;
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      keysPressed.current.add(event.key);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed.current.delete(event.key);
  };

  return {
    position: screenPosition, // Screen position for rendering
    canvasPosition, // Canvas position for multiplayer
    currentFrame,
    isMoving,
    facingDirection,
    currentPositionRef: currentCanvasPositionRef, // Canvas coordinates for multiplayer
    updatePosition,
    handleKeyDown,
    handleKeyUp
  };
};

import React from 'react';
import { Position, MapRect } from '../types';
import { screenToCanvasPosition, canvasToScreenPosition } from '../utils';

interface DebugPanelProps {
  playerPosition: Position;
  playerCanvasPosition: Position;
  mapRect: MapRect;
  imageBounds: { x: number; y: number; width: number; height: number };
  currentInteractionZone?: any;
  showInteractionPrompt?: boolean;
  showDebug?: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  playerPosition,
  playerCanvasPosition,
  mapRect,
  imageBounds,
  currentInteractionZone,
  showInteractionPrompt = false,
  showDebug = false
}) => {
  if (!showDebug) return null;

  const canvasFromScreen = screenToCanvasPosition(playerPosition, mapRect);
  const screenFromCanvas = canvasToScreenPosition(playerCanvasPosition, mapRect);

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg font-mono text-xs z-50 max-w-md">
      <h3 className="text-yellow-400 font-bold mb-2">Debug Information</h3>
      
      <div className="space-y-1">
        <div className="text-green-400">
          <strong>Player Positions:</strong>
        </div>
        <div>Screen: ({Math.round(playerPosition.x)}, {Math.round(playerPosition.y)})</div>
        <div>Canvas: ({Math.round(playerCanvasPosition.x)}, {Math.round(playerCanvasPosition.y)})</div>
        <div>Canvas (from screen): ({Math.round(canvasFromScreen.x)}, {Math.round(canvasFromScreen.y)})</div>
        <div>Screen (from canvas): ({Math.round(screenFromCanvas.x)}, {Math.round(screenFromCanvas.y)})</div>
        
        <div className="text-blue-400 mt-2">
          <strong>Map Rect:</strong>
        </div>
        <div>x: {mapRect.x}, y: {mapRect.y}</div>
        <div>w: {mapRect.width}, h: {mapRect.height}</div>
        
        <div className="text-purple-400 mt-2">
          <strong>Image Bounds:</strong>
        </div>
        <div>x: {Math.round(imageBounds.x)}, y: {Math.round(imageBounds.y)}</div>
        <div>w: {Math.round(imageBounds.width)}, h: {Math.round(imageBounds.height)}</div>
        
        <div className="text-orange-400 mt-2">
          <strong>Scale Factors:</strong>
        </div>
        <div>Screen to Canvas X: {(1600 / mapRect.width).toFixed(3)}</div>
        <div>Screen to Canvas Y: {(900 / mapRect.height).toFixed(3)}</div>
        <div>Canvas to Screen X: {(mapRect.width / 1600).toFixed(3)}</div>
        <div>Canvas to Screen Y: {(mapRect.height / 900).toFixed(3)}</div>
        
        <div className="text-cyan-400 mt-2">
          <strong>Interaction Status:</strong>
        </div>
        <div>Show Prompt: {showInteractionPrompt ? 'YES' : 'NO'}</div>
        <div>Has Zone: {currentInteractionZone ? 'YES' : 'NO'}</div>
        
        {currentInteractionZone && (
          <>
            <div className="text-red-400 mt-2">
              <strong>Current Interaction Zone:</strong>
            </div>
            <div>Name: {currentInteractionZone.name}</div>
            <div>ID: {currentInteractionZone.id}</div>
            <div>Absolute: ({Math.round(currentInteractionZone.x ?? 0)}, {Math.round(currentInteractionZone.y ?? 0)})</div>
            <div>Size: {Math.round(currentInteractionZone.width ?? 0)} x {Math.round(currentInteractionZone.height ?? 0)}</div>
            <div>Relative: ({currentInteractionZone.relativeX?.toFixed(3)}, {currentInteractionZone.relativeY?.toFixed(3)})</div>
          </>
        )}
      </div>
    </div>
  );
};

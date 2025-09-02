import React from 'react';
import { MultiplayerPlayer, Position } from '../types';

interface PlayerDebugInfoProps {
  currentPlayerPosition: Position;
  currentPlayerId: string | null;
  otherPlayers: MultiplayerPlayer[];
  playerName?: string;
}

export const PlayerDebugInfo: React.FC<PlayerDebugInfoProps> = ({
  currentPlayerPosition,
  currentPlayerId,
  otherPlayers,
  playerName = 'You'
}) => {
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono max-w-xs">
      <div className="text-yellow-400 font-bold mb-2">🐛 Player Coordinates Debug</div>
      
      {/* Current Player */}
      <div className="mb-2 border-b border-gray-600 pb-2">
        <div className="text-green-400 font-semibold">
          {playerName} (You) - {currentPlayerId}
        </div>
        <div>Canvas: x:{Math.round(currentPlayerPosition.x)}, y:{Math.round(currentPlayerPosition.y)}</div>
      </div>

      {/* Other Players */}
      <div>
        <div className="text-blue-400 font-semibold mb-1">Other Players ({otherPlayers.length})</div>
        {otherPlayers.length === 0 ? (
          <div className="text-gray-400 italic">No other players</div>
        ) : (
          otherPlayers.map((player) => (
            <div key={player.playerId} className="mb-1">
              <div className="text-cyan-300">
                {player.playerName || player.playerId}
              </div>
              <div>Screen: x:{Math.round(player.position.x)}, y:{Math.round(player.position.y)}</div>
              <div className="text-xs text-gray-400">
                Moving: {player.isMoving ? 'Yes' : 'No'} | 
                Frame: {player.currentFrame} | 
                Facing: {player.facingDirection}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Connection Status */}
      <div className="mt-2 pt-2 border-t border-gray-600 text-xs">
        <div className="text-purple-400">Connection Info</div>
        <div>Room: location-{currentPlayerPosition ? Math.floor(currentPlayerPosition.x / 100) : '?'}</div>
        <div>Players Total: {otherPlayers.length + 1}</div>
      </div>
    </div>
  );
};

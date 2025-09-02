import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  playerCount: number;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting,
  error,
  playerCount
}) => {
  if (error) {
    return (
      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-mono z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-300 rounded-full"></div>
          <span>Offline: {error}</span>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-mono z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
          <span>Connecting...</span>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-mono z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-300 rounded-full"></div>
          <span>Online ({playerCount} player{playerCount !== 1 ? 's' : ''})</span>
        </div>
      </div>
    );
  }

  return null;
};

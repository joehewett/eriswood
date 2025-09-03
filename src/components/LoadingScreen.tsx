import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

interface HedgehogProps {
  id: number;
  initialX: number;
  initialY: number;
  speed: number;
  direction: number;
}


export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black flex flex-col items-center justify-center z-10">
      <div className="text-white text-2xl font-mono mb-5 relative z-10">
        Loading...
      </div>
      <div className="w-50 h-5 border-2 border-white rounded-lg overflow-hidden bg-gray-800 relative z-10">
        <div
          className="w-full h-full bg-green-500"
          style={{
            animation: 'loading 2s ease-in-out'
          }}
        />
      </div>
      <style>
        {`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};

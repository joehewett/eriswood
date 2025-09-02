import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PixelAdventure from './PixelAdventure';
import MusicPlayer from './MusicPlayer';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Secret game route */}
        <Route path="/" element={<PixelAdventure />} />
      </Routes>
      {/* Global music player */}
      <MusicPlayer />
    </>
  );
};

export default App;

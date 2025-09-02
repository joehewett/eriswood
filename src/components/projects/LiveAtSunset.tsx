import React from 'react';
import ProjectPage from '../ProjectPage';

const LiveAtSunset: React.FC = () => {
  const credits = [
    { name: 'Coro', role: 'Primary Consciousness/Voice of the Void', isHighlighted: true },
    { name: 'The Setting Sun', role: 'Lead Guitarist' },
    { name: 'Collective Festival Energy', role: 'Rhythm Section' },
    { name: 'Sacred Geometry Sound Systems', role: 'Acoustic Engineering' },
    { name: '73,000 Dancing Souls', role: 'Co-Performers' },
    { name: 'Desert Wind Orchestra', role: 'Natural Harmonics' },
    { name: 'Psilocybin Production Co.', role: 'Consciousness Expansion' },
    { name: 'Ley Line Recording Studio', role: 'Earth Energy Capture' },
    { name: 'The Milky Way Galaxy', role: 'Backdrop/Inspiration' },
    { name: 'Tomorrow\'s Children', role: 'Audience of the Future' }
  ];

  const description = `Live at Sunset captures the moment when 73,000 festival-goers temporarily merged into a single cosmic organism through the power of synchronized sonic vibration. Recorded during the summer solstice at the Interdimensional Music Festival, this concert document proves that music can literally reorganize the molecular structure of reality when enough conscious beings vibrate at the same frequency.

  The performance began at the exact moment of sunset and continued until sunrise, with the music evolving through twelve distinct phases corresponding to the sun's journey through the underworld. Using a custom-built sound system that channels energy directly from the Earth's magnetic field, each song created visible aurora patterns in the sky while causing spontaneous crop circles to appear in nearby wheat fields.

  My vocal performance required accessing states of consciousness usually only achieved by Tibetan monks after decades of meditation. I sang in frequencies that predate human language, channeling the songs that galaxies sing to each other across the cosmic void. During the climactic 47-minute version of "Cosmic Reunion," the entire audience achieved temporary telepathic connection, with many reporting shared visions of humanity's next evolutionary leap. The performance was so intense that it registered as a minor seismic event on geological monitoring equipment 200 miles away.`;

  const additionalInfo = `The concert recording has achieved legendary status, with bootleg copies circulating through underground consciousness networks worldwide. Neuroscientists studying the audience footage discovered that all 73,000 attendees' brainwaves synchronized during the performance, creating the largest documented case of collective consciousness in human history. The event has been cited as evidence that humanity is ready for its next evolutionary phase. Three babies were born during the concert, and all three emerged humming in perfect pitch. The recording is now used by NASA to maintain psychological health during long-duration space missions, as it apparently recreates the feeling of planetary connection even in the void of space.`;

  return (
    <ProjectPage
      title="Live at Sunset"
      categoryImage="/landing/bottomlefttext.PNG"
      categoryRoute="/musician"
      categoryAlt="Musician"
      credits={credits}
      description={description}
      mainImage="/coro7.webp"
      additionalInfo={additionalInfo}
    />
  );
};

export default LiveAtSunset;

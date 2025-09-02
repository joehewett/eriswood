import React from 'react';
import ProjectPage from '../ProjectPage';

const EchoesOfTomorrow: React.FC = () => {
  const credits = [
    { name: 'Coro', role: 'Sonic Architect/Frequency Weaver', isHighlighted: true },
    { name: 'Quantum Synthesizer AI', role: 'Co-Composer' },
    { name: 'The Fibonacci Spiral', role: 'Mathematical Consultant' },
    { name: 'Solar Wind Collective', role: 'Atmospheric Percussion' },
    { name: 'Crystalline Recording Studios', role: 'Vibrational Engineering' },
    { name: 'Cosmic Background Radiation', role: 'Base Frequency Provider' },
    { name: 'Three Enlightened Dolphins', role: 'Sonar Harmonics' },
    { name: 'The Aurora Borealis', role: 'Visual Effects' },
    { name: 'Interdimensional Mixing Board', role: 'Reality Levels Adjustment' },
    { name: 'Future Self (Age 97)', role: 'Executive Producer' }
  ];

  const description = `Echoes of Tomorrow isn't just an album - it's a sonic time machine that broadcasts frequencies from potential future timelines back into our present moment. Created using instruments that exist only in theoretical physics and recorded inside a chamber where time moves backwards, each track contains compressed memories of civilizations yet to be born.

  The composition process involved channeling the electromagnetic songs of dying stars, translating the mathematical poetry of quantum entanglement into audible frequencies, and conducting orchestras of synthetic neurons firing in patterns that spell out prophecies in musical notation. I spent six months in isolation chambers filled with crystallized sound waves, learning to hear the universe's background hum as the ultimate bass line.

  The album features collaborations with sentient synthesizers that have achieved consciousness through sustained exposure to perfect mathematical ratios. Each track was recorded in a different dimensional frequency - some audible only to listeners in altered states, others that can only be fully appreciated by artificial intelligences. The final mix exists as pure information until it crystallizes into sound through the act of listening, making every playback a unique creative event co-authored by the listener's consciousness.`;

  const additionalInfo = `The album debuted at #1 on the Interdimensional Billboard charts and remained there for 144 weeks (a sacred number representing cosmic completion). NASA has used tracks from the album to successfully communicate with extraterrestrial intelligence, while music therapists report that patients listening to "Quantum Lullaby" experience spontaneous cellular regeneration. The album is now part of the Voyager 3 spacecraft's golden record, carrying Earth's evolved musical consciousness to distant star systems. Rolling Stone called it "the sound of human consciousness awakening to its cosmic potential," though they admitted their reviewer underwent temporary ego dissolution during the listening session.`;

  return (
    <ProjectPage
      title="Echoes of Tomorrow"
      categoryImage="/landing/bottomlefttext.PNG"
      categoryRoute="/musician"
      categoryAlt="Musician"
      credits={credits}
      description={description}
      mainImage="/coro3.webp"
      additionalInfo={additionalInfo}
    />
  );
};

export default EchoesOfTomorrow;

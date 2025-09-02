import React from 'react';
import ProjectPage from '../ProjectPage';

const SummerDreams: React.FC = () => {
  const credits = [
    { name: 'Luna Starweaver', role: 'Director' },
    { name: 'Phoenix Cloudchaser', role: 'Producer' },
    { name: 'Coro', role: 'Lead Actress', isHighlighted: true },
    { name: 'Cosmic Ray Chen', role: 'Cinematographer' },
    { name: 'Violet Prism', role: 'Supporting Actor' },
    { name: 'Echo Dimension', role: 'Editor' },
    { name: 'Kaleidoscope Jones', role: 'Production Designer' },
    { name: 'Reverb Thompson', role: 'Sound Alchemist' },
    { name: 'Neon Butterfly', role: 'Costume Conjurer' },
    { name: 'Spectrum Williams', role: 'Visual Effects Shaman' }
  ];

  const description = `Summer Dreams is a hallucinogenic coming-of-age odyssey that dissolves the boundaries between consciousness and reality. Set in a small town where the sidewalks melt into liquid mercury under the summer heat, the film follows Maya (Coro) as she discovers that her teenage angst is literally reshaping the fabric of spacetime around her.

  Shot using custom-built kaleidoscope lenses and experimental color-shifting film stock, every frame pulsates with the fever-dream intensity of adolescent transformation. The narrative structure mirrors the chaos of synaptic firing during rapid neural development - scenes fractal into infinite variations, conversations happen backwards through time, and the protagonist's emotions manifest as sentient geometric entities that dance through the frame.

  This isn't just acting - it's channeling the raw energy of metamorphosis. I had to inhabit multiple quantum states simultaneously, embodying every possible version of Maya across parallel timelines. The performance required me to access primal frequencies of human experience, tapping into the collective unconscious of teenage transformation. Some scenes were filmed during lucid dreams using experimental sleep-cinema techniques developed specifically for this project.`;

  const additionalInfo = `The film premiered at the Interdimensional Cinema Festival where audiences reported lasting synesthetic experiences. Critics described it as "a lysergic love letter to the chaos of growing up" and "the most authentic portrayal of teenage consciousness ever captured on film." The unique filming techniques have spawned a new movement in psychedelic cinema, with film schools now offering courses in "consciousness cinematography." Three viewers allegedly achieved temporary enlightenment during the climactic metamorphosis sequence.`;

  return (
    <ProjectPage
      title="Summer Dreams"
      categoryImage="/landing/toplefttext.PNG"
      categoryRoute="/actress"
      categoryAlt="Actress"
      credits={credits}
      description={description}
      mainImage="/coro5.webp"
      additionalInfo={additionalInfo}
    />
  );
};

export default SummerDreams;

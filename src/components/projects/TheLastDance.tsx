import React from 'react';
import ProjectPage from '../ProjectPage';

const TheLastDance: React.FC = () => {
  const credits = [
    { name: 'Transcendence Theatre Collective', role: 'Production Company' },
    { name: 'Mystic Maven Rodriguez', role: 'Director' },
    { name: 'Coro', role: 'The Eternal Dancer', isHighlighted: true },
    { name: 'Cosmos Murphy', role: 'The Time Keeper' },
    { name: 'Astral Johnson', role: 'The Memory Weaver' },
    { name: 'Infinity Williams', role: 'Set Designer/Portal Architect' },
    { name: 'Vortex Sound Collective', role: 'Live Sonic Manipulation' },
    { name: 'Prism Light Institute', role: 'Illumination Choreography' },
    { name: 'Crystal Costume Conjurers', role: 'Metamorphic Wardrobe' },
    { name: 'The Audience', role: 'Co-Creators of Reality' }
  ];

  const description = `The Last Dance is not a theatrical performance - it's a collective consciousness experiment disguised as avant-garde theater. Each night, the audience becomes part of a living mandala where movement, sound, and shared intention combine to tear holes in the fabric of linear time.

  As The Eternal Dancer, I embody the final moment before the universe collapses back into singularity, when all energy, all movement, all stories compress into one perfect gesture. The "stage" is a 360-degree crystalline chamber where gravity shifts based on the collective emotional state of the audience. My choreography channels the death throes of dying stars, the birth cries of new galaxies, and the infinite spiral dance of DNA unfolding across cosmic time.

  No two performances are identical because the show exists in quantum superposition until observed. The audience's presence collapses the probability waves into a specific reality, meaning every viewer literally co-creates the performance they witness. I had to train in zero-gravity chambers, study with Tibetan death meditation masters, and undergo three months of sensory deprivation to access the necessary states of consciousness. The role required me to die and be reborn 347 times during the six-month run.`;

  const additionalInfo = `The production ran for six months at the Interdimensional Arts Center, with each performance witnessed by exactly 108 audience members (the sacred number of cosmic completion). Critics described it as "theater that transcends theater" and "the closest humans have come to experiencing pure consciousness." The show has been banned in seven countries for "reality disruption" and is studied by quantum physicists as evidence of observer-effect consciousness. Three audience members reportedly achieved spontaneous enlightenment, and the entire run was recorded using cameras that only function in altered states of consciousness. The New York Times called it "devastatingly beautiful," though their critic admitted they weren't sure if they were reviewing the performance or their own soul.`;

  return (
    <ProjectPage
      title="The Last Dance"
      categoryImage="/landing/toplefttext.PNG"
      categoryRoute="/actress"
      categoryAlt="Actress"
      credits={credits}
      description={description}
      mainImage="/coro14.webp"
      additionalInfo={additionalInfo}
    />
  );
};

export default TheLastDance;

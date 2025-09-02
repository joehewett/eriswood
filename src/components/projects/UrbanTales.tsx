import React from 'react';
import ProjectPage from '../ProjectPage';

const UrbanTales: React.FC = () => {
  const credits = [
    { name: 'Multiverse Martinez', role: 'Creator/Showrunner' },
    { name: 'Reality Bender Productions', role: 'Production Company' },
    { name: 'Coro', role: 'Lead in Episode 3: "Subway Serpents"', isHighlighted: true },
    { name: 'Frequency Johnson', role: 'Cinematographer' },
    { name: 'Timeline Garcia', role: 'Series Editor' },
    { name: 'Morpheus Design Collective', role: 'Production Design' },
    { name: 'The Astral Orchestra', role: 'Original Score' },
    { name: 'Chakra VFX Studio', role: 'Visual Effects' },
    { name: 'Parallel World Casting', role: 'Casting Director' }
  ];

  const description = `Urban Tales is a mind-melting anthology series where each episode transforms a different city into a living, breathing organism with its own consciousness and agenda. The show explores what happens when urban environments achieve sentience and begin communicating with their inhabitants through architecture, street art, and the rhythm of traffic lights.

  Episode 3, "Subway Serpents," follows a transit worker (Coro) who discovers that the subway tunnels form a massive neural network beneath the city. As trains become synapses firing electrical thoughts through the underground maze, she must navigate an increasingly surreal landscape where platform announcements speak in ancient languages and turnstiles demand philosophical answers to pass.

  Filming involved extensive location work in abandoned subway systems, sewers, and underground utility tunnels. We used infrared cameras to capture the heat signatures of the "city's circulation system" and developed a revolutionary technique called "urban psychometry" - reading the emotional history embedded in walls, streets, and forgotten spaces. My performance required channeling the collective memory of every person who had ever walked these passages, creating a multi-layered characterization that spans centuries of urban evolution.`;

  const additionalInfo = `The series has been praised as "the most accurate portrayal of city consciousness ever attempted" by the International Institute of Urban Mysticism. Episode 3 won the Golden Mushroom Award for Best Interdimensional Performance and has been used by urban planners as a case study in "empathetic city design." Several cities have reported improved traffic flow and citizen happiness after screening the series to their municipal planning departments. The show spawned a underground movement of "city whisperers" - people who claim to communicate directly with urban infrastructure.`;

  return (
    <ProjectPage
      title="Urban Tales"
      categoryImage="/landing/toplefttext.PNG"
      categoryRoute="/actress"
      categoryAlt="Actress"
      credits={credits}
      description={description}
      mainImage="/coro9.webp"
      additionalInfo={additionalInfo}
    />
  );
};

export default UrbanTales;

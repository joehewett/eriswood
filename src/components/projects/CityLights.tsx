import React from 'react';
import ProjectPage from '../ProjectPage';

const CityLights: React.FC = () => {
  const credits = [
    { name: 'Coro', role: 'Director/Consciousness Conductor', isHighlighted: true },
    { name: 'The City Itself', role: 'Co-Director' },
    { name: 'Electromagnetic Spectrum', role: 'Cinematographer' },
    { name: 'Collective Urban Unconscious', role: 'Producer' },
    { name: 'Neon Frequency', role: 'Light Editor' },
    { name: 'Synaptic Sound Design', role: 'Audio Alchemist' },
    { name: '47 Anonymous Strangers', role: 'Unwitting Subjects' },
    { name: 'Traffic Light Oracle', role: 'Narrative Consultant' },
    { name: 'Street Cat Named Schrodinger', role: 'Quantum Advisor' },
    { name: 'The Viewers', role: 'Final Editors of Reality' }
  ];

  const description = `City Lights is a documentary that documents itself while being watched, creating an infinite feedback loop of observation and creation. Using cameras that only record during peak neurological activity, the film captures the exact moment when urban environments transition from background to foreground consciousness - when buildings begin to dream and streetlights start composing poetry in morse code.

  Shot over three years using telepathic filming techniques, the documentary follows the electromagnetic conversations happening between skyscrapers after midnight. Traffic signals reveal themselves as an ancient communication network, while subway rumbles spell out messages in seismic braille. The film required developing new technologies that could capture thought-forms as they crystallize into architecture.

  As director, I had to become a conduit between human and urban consciousness, learning to think in frequencies that concrete can understand. The editing process involved 72 hours of continuous meditation inside a sensory deprivation tank filled with water collected from every major city's storm drains. The final cut exists in eleven dimensions simultaneously, though conventional projectors can only display three at a time. Some viewers report seeing their own future reflected in storefront windows during the climactic neon sequence.`;

  const additionalInfo = `The film premiered simultaneously in forty-seven cities worldwide, with each screening uniquely influenced by local electromagnetic fields. Architecture critics called it "the first documentary ever made BY a city, FOR cities" while urban planners have adopted its revelation that traffic patterns follow ancient ley lines. The film has been credited with reducing urban anxiety by 23% in cities where it's been screened, as viewers learn to recognize the underlying intelligence governing their metropolitan environment. The Vatican has classified it as "miraculous urban mysticism" while the Institute of Concrete Consciousness uses it as training material for their emerging field of architectural telepathy.`;

  return (
    <ProjectPage
      title="City Lights"
      categoryImage="/landing/toprighttext.PNG"
      categoryRoute="/director"
      categoryAlt="Director"
      credits={credits}
      description={description}
      mainImage="/coro6.webp"
      additionalInfo={additionalInfo}
    />
  );
};

export default CityLights;

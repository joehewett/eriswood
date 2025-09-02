import React from 'react';
import ProjectPage from '../ProjectPage';

const BehindTheScenes: React.FC = () => {
  const credits = [
    { name: 'Coro', role: 'Meta-Director/Reality Documentarian', isHighlighted: true },
    { name: 'The Creative Process Itself', role: 'Subject/Co-Director' },
    { name: 'Invisible Camera Crew', role: 'Quantum Cinematographers' },
    { name: 'Collective Unconscious', role: 'Script Writer' },
    { name: 'Synchronicity Department', role: 'Continuity' },
    { name: 'Muse Collective', role: 'Inspiration Providers' },
    { name: 'The Void Between Thoughts', role: 'Location Manager' },
    { name: 'Creative Block Entity', role: 'Antagonist' },
    { name: 'Flow State Corporation', role: 'Executive Producers' },
    { name: 'Future Audience', role: 'Final Editors' }
  ];

  const description = `Behind the Scenes documents the actual creation of Behind the Scenes while simultaneously creating itself - a meta-documentary that becomes more real the more it's observed. This recursive project captures the usually invisible process of creativity materializing from pure potential into manifest reality across multiple mediums and dimensions.

  Using cameras that only function during moments of inspiration, the film reveals the normally hidden ecosystem of thought-forms, creative entities, and interdimensional collaborators that participate in every artistic endeavor. Watch as ideas literally crystallize out of the void, take on semi-corporeal form, and fight for the privilege of being expressed through human consciousness.

  The project required developing new documentary techniques for filming non-material phenomena - from capturing the exact moment when inspiration strikes (it appears as a golden geometric pattern entering through the crown chakra) to documenting the heated negotiations between different potential creative outcomes in the realm of pure possibility. I had to learn to simultaneously be the filmmaker, the subject, and the film itself, existing in a state of creative superposition where all potential projects exist until one is observed into existence. The most challenging sequence shows me editing footage of myself editing footage in an infinite recursive loop that lasted subjectively three years but objectively seventeen minutes.`;

  const additionalInfo = `The film serves as the definitive documentation of how creativity actually works, revolutionizing the fields of consciousness studies, artistic pedagogy, and metaphysics. Art schools now use it to teach students to perceive and collaborate with the usually invisible creative forces. The documentary has been credited with causing a 340% increase in global creative output, as viewers learn to recognize and optimize their own creative processes. Several governments have classified the film as a cultural weapon due to its ability to dramatically enhance national creative capacity. The paradox of documenting the creation of its own documentation has led to its adoption by philosophy departments as the ultimate example of self-referential existence. Critics are unsure whether to review the film or the film's effect on reality itself.`;

  return (
    <ProjectPage
      title="Behind the Scenes"
      categoryImage="/landing/bottomrighttext.PNG"
      categoryRoute="/me"
      categoryAlt="Me"
      credits={credits}
      description={description}
      mainImage="/coro11.webp"
      additionalInfo={additionalInfo}
    />
  );
};

export default BehindTheScenes;

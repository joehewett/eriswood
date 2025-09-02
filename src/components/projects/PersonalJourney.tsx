import React from 'react';
import ProjectPage from '../ProjectPage';

const PersonalJourney: React.FC = () => {
  const credits = [
    { name: 'Coro (All 47 Selves)', role: 'Interdimensional Explorer', isHighlighted: true },
    { name: 'Past Life Regression Hypnotist', role: 'Timeline Navigator' },
    { name: 'Mirror Dimension', role: 'Reality Consultant' },
    { name: 'Sacred Plant Teachers', role: 'Consciousness Expansion Advisors' },
    { name: 'The Akashic Records', role: 'Archive Access Provider' },
    { name: 'Shadow Self', role: 'Co-Producer' },
    { name: 'Higher Self', role: 'Executive Producer' },
    { name: 'Quantum Camera Collective', role: 'Multi-Dimensional Cinematography' },
    { name: 'The Observer', role: 'Director' },
    { name: 'Infinite Potential', role: 'Editor' }
  ];

  const description = `Personal Journey is a visual autobiography shot across seventeen different dimensions of existence, documenting my path from ordinary human consciousness to multidimensional awareness. Using cameras that can photograph thoughts and sound equipment that records the frequency of enlightenment, this project maps the topology of personal transformation in real-time.

  The journey begins in consensus reality but quickly spirals through parallel dimensions where I exist as a tree, a star, a mathematical equation, and a color that has no name. Each chapter was filmed using different consciousness-altering technologies - some segments were shot during ayahuasca ceremonies in the Amazon, others while floating in sensory deprivation tanks, and several while in states of clinical death and subsequent resurrection.

  This isn't just a documentary about transformation - it IS transformation. The viewing experience is designed to trigger similar consciousness expansion in the audience through the strategic use of subliminal frequency modulation and sacred geometric visual patterns. I had to become my own subject and object simultaneously, observing my own dissolution and reconstruction through the lens of expanded awareness. The most challenging aspect was filming my own ego death - the camera literally had to be operated by my higher self while my personality temporarily ceased to exist.`;

  const additionalInfo = `The project has been used by the Institute for Consciousness Research as definitive proof that human awareness can transcend dimensional boundaries. Viewers report experiencing their own past-life memories while watching, and several have had spontaneous out-of-body experiences during the segment filmed in zero gravity. The film exists in a state of constant evolution - new scenes appear based on the collective unconscious input of its audience, making it a living document of human transformation. Psychiatrists have noted that patients with dissociative disorders find the film therapeutic, as it normalizes non-linear identity experience. The Dalai Lama called it "the most authentic documentation of the spiritual path I have witnessed," though he cautioned that viewers should have a spiritual teacher present during screening.`;

  return (
    <ProjectPage
      title="Personal Journey"
      categoryImage="/landing/bottomrighttext.PNG"
      categoryRoute="/me"
      categoryAlt="Me"
      credits={credits}
      description={description}
      mainImage="/coro4.webp"
      additionalInfo={additionalInfo}
    />
  );
};

export default PersonalJourney;

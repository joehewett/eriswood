import React from 'react';
import ProjectPage from '../ProjectPage';

const MidnightEchoes: React.FC = () => {
  const credits = [
    { name: 'Coro', role: 'Director', isHighlighted: true },
    { name: 'Maria Rodriguez', role: 'Producer' },
    { name: 'Carlos Mendez', role: 'Cinematographer' },
    { name: 'Juan Pablo Silva', role: 'Editor' },
    { name: 'Ana Lucia Torres', role: 'Production Designer' },
    { name: 'Roberto Fernandez', role: 'Sound Design' },
    { name: 'Sofia Martinez', role: 'Visual Effects' },
    { name: 'Diego Ramirez', role: 'Color Grading' }
  ];

  const description = `Midnight Echoes is an experimental short film that pushes the boundaries of conventional storytelling through innovative cinematography and avant-garde narrative techniques. The project explores themes of memory, time, and the subconscious mind, utilizing cutting-edge technology and unconventional filming methods to create a truly unique cinematic experience.

  Shot entirely at night using infrared cameras and custom lighting rigs, the film captures the hidden world that exists when most people are asleep. The narrative structure is non-linear, with scenes that loop, reverse, and overlap, creating a dreamlike quality that mirrors the fragmented nature of human memory.

  As the director, I wanted to challenge the audience's perception of reality and time. The film uses a combination of practical effects, digital manipulation, and experimental sound design to create an immersive experience that lingers in the viewer's mind long after the credits roll. The project represents a bold step forward in experimental cinema, combining traditional filmmaking techniques with cutting-edge technology.`;

  const additionalInfo = `The film has been selected for numerous international experimental film festivals and has received critical acclaim for its innovative approach to storytelling. The infrared cinematography technique developed during production has since been adopted by other filmmakers and has been featured in several cinematography workshops and masterclasses. The project also served as a testing ground for new digital post-production workflows that have influenced the broader filmmaking community.`;

  return (
    <ProjectPage
      title="Midnight Echoes"
      categoryImage="/landing/toprighttext.PNG"
      categoryRoute="/director"
      categoryAlt="Director"

      credits={credits}
      description={description}
      mainImage="/coro2.webp"
      additionalInfo={additionalInfo}
    />
  );
};

export default MidnightEchoes;

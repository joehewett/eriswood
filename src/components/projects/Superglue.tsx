import React from 'react';
import ProjectPage from '../ProjectPage';

const Superglue: React.FC = () => {
  const credits = [
    { name: 'Coro Benavent', role: 'Director', isHighlighted: true },
    { name: 'Chiara Carrubba', role: 'Producer' },
    { name: 'Paula Lindblom', role: 'Starring' },
    { name: 'Harry Mason', role: 'Starring' },
    { name: 'Mariia Litvin', role: 'Dancer & Choreographer' },
    { name: 'Stepan Kozhaev', role: 'Dancer & Choreographer' },
    { name: 'Diego Benavent', role: 'Artist' },
    { name: 'Leon Silavant', role: 'DOP' },
    { name: 'Arianna Scarpa', role: '1st AD' },
    { name: 'Shalin Murphy', role: 'Art Director' },
    { name: 'David Gregory', role: 'AC' },
    { name: 'Gabrielle Torreborre', role: 'Production Assistant & Editor' },
    { name: 'Karina Stephan', role: 'Gaffer' },
    { name: 'Fatima Zahara Khan', role: 'Gaffer' },
    { name: 'Maria Mayer', role: 'Art Assistant' },
    { name: 'Kitty Lok Lam Ma', role: 'Art Assistant' },
    { name: 'Maria Bekker', role: 'Hair and Make-up' },
    { name: 'Karan Kaur', role: 'Hair and Make-up' },
    { name: 'Rastine Mir', role: 'Spark' }
  ];

  const description = `SUPERGLUE is a narrative music video for my self-composed song, representing a deeply personal artistic milestone in my career as both a musician and director. The film explores the complex dynamics of a couple in crisis, with Paula Lindblom and Harry Mason delivering powerful performances as the troubled pair, while Mariia Litvin and Stepan Kozhaev - both trained at the Conservatoire - embody their alter egos through expressive dance.

  This project allowed me to merge my musical and directorial visions, creating a visual narrative that amplifies the emotional depth of the song I wrote. The concept of using dancers as alter egos was central to exploring the internal emotional landscape of relationships in turmoil, bringing a theatrical dimension to the storytelling that reflects my training at Corazza, Madrid, and The Bristol Old Vic.

  Working with DOP Leon Silavant and Art Director Shalin Murphy, we crafted a visual language that could seamlessly transition between the realistic portrayal of the couple and the more abstract, emotional representation through dance. The collaborative process with my brother Diego Benavent as artist added another layer of creative synergy to this deeply personal project.`;

  const additionalInfo = `Directing SUPERGLUE in July 2025 marked a pivotal moment where my decade of creating music and art converged with my directorial ambitions. This project embodies my belief in the freedom to create with an open heart, bringing together the creativity and humanity that emerges when groups work toward common objectives.

  The choreographed sequences required careful coordination with Mariia and Stepan, whose Conservatoire training brought a level of technical precision and emotional depth that elevated the entire production. Working with gaffers Karina Stephan and Fatima Zahara Khan, we created lighting that could support both the intimate realism of the couple&rsquo;s scenes and the more expressive, dance-driven sequences.

  The post-production collaboration with Gabrielle Torreborre as editor was particularly meaningful, as she would later become my co-creative partner in our upcoming production company. The color grading by Santino Colour at Company 3 helped achieve the visual tone that matched the emotional complexity of the song, creating a cohesive piece that represents both my musical composition and directorial vision.`;

  return (
    <ProjectPage
      title="SUPERGLUE"
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

export default Superglue;

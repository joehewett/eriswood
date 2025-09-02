import React from 'react';
import ProjectPage from '../ProjectPage';

const PadreHijoPastor: React.FC = () => {
  const credits = [
    { name: 'Mori', role: 'Director' },
    { name: 'Coro Benavent', role: 'Director\'s Assistant', isHighlighted: true },
    { name: 'Lottie Maher', role: 'Creative Producer' },
    { name: 'Dani Benejam', role: 'DoP' },
    { name: 'Holly Moy', role: 'Producer' },
    { name: 'Sebastian R. Pardo', role: 'Locations Manager' }
  ];

  const description = `Padre. Hijo. Pastor is a feature documentary following shepherds during their 40-day transhumance journey from southern to northern Spain - a disappearing tradition that represents centuries of Spanish cultural heritage. Working as Director&rsquo;s Assistant to Mori, a Scottish director, I became the crucial bridge between the filmmaking team and our Spanish subjects, as the director didn&rsquo;t speak Spanish.

  My role extended far beyond traditional assistant duties - I was responsible for gathering local context, orchestrating conversations about this vanishing way of life, and capturing authentic moments that might have been lost without cultural and linguistic understanding. This experience taught me the profound responsibility that comes with documenting disappearing traditions and the trust that communities place in filmmakers.

  Working in June 2025 on this project deepened my appreciation for documentary filmmaking as a form of cultural preservation. The 40-day journey required not just technical filmmaking skills, but cultural sensitivity, language skills, and the ability to build genuine relationships with people whose way of life we were documenting. It was both humbling and inspiring to witness this ancient practice firsthand.`;

  const additionalInfo = `The experience of being the cultural and linguistic bridge on this production was transformative for my understanding of documentary filmmaking&rsquo;s social responsibility. Working with Creative Producer Lottie Maher, Producer Holly Moy, and DoP Dani Benejam, I learned how international co-productions require not just technical coordination, but deep cultural understanding and respect.

  The shepherds we followed shared stories and traditions that had been passed down through generations, and I felt the weight of ensuring their voices were authentically represented. This role required me to be simultaneously a cultural translator, a production coordinator, and a guardian of the subjects&rsquo; dignity and agency in their own story.

  The skills I developed during those 40 days - from building trust with documentary subjects to managing the complex logistics of following a moving story across the Spanish landscape - have become fundamental to my approach as a filmmaker. This project reinforced my belief that the most powerful stories often come from communities whose voices are rarely heard, and that filmmakers have a responsibility to serve those stories with integrity and respect.`;

  return (
    <ProjectPage
      title="Padre. Hijo. Pastor"
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

export default PadreHijoPastor;

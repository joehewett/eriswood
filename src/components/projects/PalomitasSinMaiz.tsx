import React from 'react';
import ProjectPage from '../ProjectPage';

const PalomitasSinMaiz: React.FC = () => {
  const credits = [
    { name: 'Gabrielle Torreborre', role: 'Director & Editor' },
    { name: 'Coro Benavent', role: 'Producer & Starring', isHighlighted: true },
    { name: 'Gully', role: 'Starring' },
    { name: 'Dinah Stabb', role: 'Starring' },
    { name: 'James Lahaise', role: 'DOP' },
    { name: 'Lucia Larah', role: '1st AD' },
    { name: 'Kate Klvrnv', role: 'AC' },
    { name: 'Lewis Taylor', role: 'Camera Trainee' },
    { name: 'Gina Jatkinson', role: 'Art Director' },
    { name: 'Megha Maruca', role: 'Costume Designer' },
    { name: 'Aanandita Dhar', role: 'Hair Stylist' },
    { name: 'Mash A', role: 'MUA' },
    { name: 'Jane Giubbilei', role: 'MUA' },
    { name: 'Teppnox', role: 'BTS Photography' },
    { name: 'Santino Colour', role: 'Colourist' }
  ];

  const description = `Palomitas sin maíz is an deeply personal music video born from grief and love - a song I wrote to my grandmother on the day she passed away in May 2025. This project explores my relationship with her and the other powerful female role models in my life, creating a visual narrative that honors their influence on who I am as an artist and person.

  Working as both producer and performer alongside Gabrielle Torreborre as director, we created something that feels both intimate and cinematic. The cast includes Dinah Stabb, Gully (a fellow musician), a horse, and myself - each element carefully chosen to represent different aspects of the story I needed to tell about loss, memory, and the women who shaped me.

  Shot on 16mm film with cinematography by James Lahaise, we embraced the tactile, emotional quality that only analog film can provide. The grain and warmth of the medium felt essential to capturing the nostalgic, bittersweet nature of the narrative. This project challenged me to be vulnerable both in front of and behind the camera, balancing the raw emotion of the subject matter with the technical demands of producing a professional music video.`;

  const additionalInfo = `The 2-day shoot was a labor of love that gained recognition from the film community - featured by Kodak for our use of their 16mm stock, reviewed by Promonews, and pre-nominated for the Shiny Awards. This recognition felt particularly meaningful given the personal nature of the project and our commitment to shooting on film.

  Art Director Gina Jatkinson and Costume Designer Megha Maruca created a visual world that honored both the intimate family story and the broader themes of female strength and legacy. The hair and makeup team, led by Aanandita Dhar, Mash A, and Jane Giubbilei, understood the emotional weight of the project and helped create looks that felt authentic to the story we were telling.

  The Kodak film stock, developed by Digital Orchard, gave us the organic, timeless quality we needed to tell this multigenerational story. Gabrielle&rsquo;s editing and the color grading by Santino Colour at Company 3 preserved the film&rsquo;s emotional authenticity while creating a polished final piece. This project deepened my creative partnership with Gabrielle, setting the foundation for our upcoming production company launch in August 2025.`;

  return (
    <ProjectPage
      title="Palomitas Sin Maiz"
      categoryImage="/landing/toplefttext.PNG"
      categoryRoute="/actress"
      categoryAlt="Actress"

      credits={credits}
      description={description}
      mainImage="/coro-headshot.jpg"
      additionalInfo={additionalInfo}
    />
  );
};

export default PalomitasSinMaiz;

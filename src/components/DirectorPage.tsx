import React from 'react';
import Navbar from './Navbar';
import ProjectCard from './ProjectCard';

const DirectorPage: React.FC = () => {
  const projects = [
    {
      id: 1,
      image: '/coro11.webp',
      title: 'SUPERGLUE',
      description: 'Music video starring Paula Lindblom & Harry Mason. Directed by Coro Benavent, produced by Chiara Carrubba, with choreography by Mariia Litvin & Stepan Kozhaev.',
      route: '/director/superglue'
    },
    {
      id: 2,
      image: '/coro6.webp',
      title: 'Palomitas sin maíz',
      description: 'Creative collaboration with Gabrielle Torreborre. Starring Coro Benavent, Gully, and Dinah Stabb. Directed by Gabrielle Torreborre, produced by Coro Benavent.',
      route: '/director/palomitas-sin-maiz'
    },
    {
      id: 3,
      image: '/coro3.webp',
      title: 'Padre. Hijo. Pastor',
      description: 'Feature documentary directed by Mori. Served as Director\'s Assistant alongside creative producer Lottie Maher and DoP Dani Benejam.',
      route: '/director/padre-hijo-pastor'
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <Navbar 
        categoryImage="/landing/toprighttext.PNG"
        categoryRoute="/director"
        categoryAlt="Director"
      />
      
      <div className="px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              image={project.image}
              title={project.title}
              description={project.description}
              route={project.route}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectorPage;

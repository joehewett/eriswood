import React from 'react';
import Navbar from './Navbar';
import ProjectCard from './ProjectCard';

const ActressPage: React.FC = () => {
  // Dummy project data - replace with real data later
  const projects = [
    {
      id: 1,
      image: '/coro1.webp',
      title: 'Palomitas Sin Maiz',
      description: 'A short film exploring the boundaries of reality and imagination',
      route: '/actress/palomitas-sin-maiz'
    },
    {
      id: 2,
      image: '/coro5.webp',
      title: 'Summer Dreams',
      description: 'Feature film debut as the lead character in this coming-of-age story',
      route: '/actress/summer-dreams'
    },
    {
      id: 3,
      image: '/coro9.webp',
      title: 'Urban Tales',
      description: 'Anthology series showcasing diverse stories from city life',
      route: '/actress/urban-tales'
    },
    {
      id: 4,
      image: '/coro14.webp',
      title: 'The Last Dance',
      description: 'Dramatic performance in this award-winning theater production',
      route: '/actress/the-last-dance'
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <Navbar 
        categoryImage="/landing/toplefttext.PNG"
        categoryRoute="/actress"
        categoryAlt="Actress"
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

export default ActressPage;

import React from 'react';
import Navbar from './Navbar';
import ProjectCard from './ProjectCard';

const MusicianPage: React.FC = () => {
  const projects = [
    {
      id: 1,
      image: '/coro3.webp',
      title: 'Echoes of Tomorrow',
      description: 'Debut album blending electronic and classical elements',
      route: '/musician/echoes-of-tomorrow'
    },
    {
      id: 2,
      image: '/coro7.webp',
      title: 'Live at Sunset',
      description: 'Concert recording from the summer festival tour',
      route: '/musician/live-at-sunset'
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <Navbar 
        categoryImage="/landing/bottomrighttext.PNG"
        categoryRoute="/musician"
        categoryAlt="Musician"
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

export default MusicianPage;

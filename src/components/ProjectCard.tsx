import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  route: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, title, description, route }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(route)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full aspect-square cursor-pointer overflow-hidden bg-black rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 ease-out"
    >
      {/* Project image */}
      <img 
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
      />
      
      {/* Modern overlay with blur backdrop */}
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-500 ease-out ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Content overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500 ease-out ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Title with modern styling */}
        <div className="mb-4">
          <h3 className="text-4xl font-bold text-white font-handwritten mb-2 drop-shadow-lg">
            {title}
          </h3>
          <div className={`h-0.5 bg-white/80 transition-all duration-500 ease-out ${
            isHovered ? 'w-16' : 'w-0'
          }`} />
        </div>
        
        {/* Description with fade-in effect */}
        <p className={`text-sm text-white/90 leading-relaxed transition-all duration-700 delay-100 ease-out ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {description}
        </p>
      </div>
      
      {/* Subtle corner accent */}
      <div
        className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/60 transition-all duration-500 ease-out ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      />
    </div>
  );
};

export default ProjectCard;

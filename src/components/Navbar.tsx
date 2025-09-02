import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  categoryImage?: string;
  categoryRoute?: string;
  categoryAlt?: string;
}

const Navbar: React.FC<NavbarProps> = ({ categoryImage, categoryRoute, categoryAlt }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-black bg-opacity-70 backdrop-blur-md flex items-center px-10 z-50 gap-5">
      {/* Coro logo - always goes to homepage */}
      <img 
        src="/coro_text.png" 
        alt="Coro"
        onClick={() => navigate('/')}
        className="!h-12 !w-auto cursor-pointer object-contain"
      />
      
      {/* Category text image if provided */}
      {categoryImage && (
        <img 
          src={categoryImage}
          alt={categoryAlt || 'Category'}
          onClick={() => categoryRoute && navigate(categoryRoute)}
          className={`h-10 object-contain ${categoryRoute ? 'cursor-pointer' : 'cursor-default'}`}
        />
      )}
    </nav>
  );
};

export default Navbar;

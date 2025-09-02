import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  
  // Check if device is mobile/touch-enabled
  const isMobile = () => {
    return window.innerWidth < 768 || 'ontouchstart' in window;
  };
  
  const quadrants = [
    { 
      bg: '/landing/topleft.jpg', 
      text: '/landing/toplefttext.PNG',
      alt: 'Top Left',
      route: '/actress'
    },
    { 
      bg: '/landing/topright.JPG', 
      text: '/landing/toprighttext.PNG',
      alt: 'Top Right',
      route: '/director'
    },
    { 
      bg: '/landing/bottomleft.jpeg', 
      text: '/landing/bottomlefttext.PNG',
      alt: 'Bottom Left',
      route: '/me'
    },
    { 
      bg: '/landing/bottomright.jpeg', 
      text: '/landing/bottomrighttext.PNG',
      alt: 'Bottom Right',
      route: '/musician'
    }
  ];

  useEffect(() => {
    // Debug: Check if images are loading
    const img = new window.Image();
    img.onload = () => console.log('Coro text loaded successfully');
    img.onerror = () => console.error('Failed to load coro_text.png');
    img.src = '/coro_text.png';
    
    // Debug: Check if quadrant background images are loading
    quadrants.forEach((quadrant, index) => {
      const bgImg = new window.Image();
      bgImg.onload = () => console.log(`Quadrant ${index} background image loaded: ${quadrant.bg}`);
      bgImg.onerror = () => console.error(`Failed to load quadrant ${index} background image: ${quadrant.bg}`);
      bgImg.src = quadrant.bg;
    });
  }, []);

  return (
    <div className="homepage-no-scroll fixed top-0 left-0 w-screen h-screen">
      {/* 2x2 Grid of images */}
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
        {quadrants.map((quadrant, index) => (
          <div 
            key={index}
            className="relative overflow-hidden"
            onMouseEnter={(e) => {
              if (isMobile()) return; // Skip hover effects on mobile
              console.log(`Hovering quadrant ${index}`);
              const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement;
              const textImg = e.currentTarget.querySelector('.text-img') as HTMLElement;
              if (overlay) overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
              if (textImg) textImg.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              if (isMobile()) return; // Skip hover effects on mobile
              const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement;
              const textImg = e.currentTarget.querySelector('.text-img') as HTMLElement;
              if (overlay) overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
              if (textImg) textImg.style.opacity = '0';
            }}
            onClick={() => navigate(quadrant.route)}
          >
            {/* Background Image */}
            <img 
              src={quadrant.bg} 
              alt={quadrant.alt}
              className="quadrant-bg w-full h-full object-cover absolute inset-0 z-0"
              onLoad={() => console.log(`Background image ${index} loaded successfully`)}
              onError={(e) => {
                console.error(`Failed to load background image ${index}:`, quadrant.bg);
                // Fallback: set a background color if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.backgroundColor = '#333';
              }}
            />
            
            {/* Hover overlay */}
            <div 
              className="overlay absolute inset-0 flex items-center justify-center bg-transparent md:bg-black md:bg-opacity-0 transition-colors duration-300 ease-in-out cursor-pointer z-10"
            >
              {/* Text overlay image */}
              <img 
                className="text-img max-w-[80%] max-h-[80%] object-contain opacity-100 md:opacity-0 transition-opacity duration-300 ease-in-out pointer-events-none"
                src={quadrant.text}
                alt={`${quadrant.alt} Text`}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Centered coro_text.png */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        <img 
          src="/coro_text.png" 
          alt="Coro Text"
          className="max-w-[50%] max-h-[50%] object-contain"
          onError={() => console.error('Failed to load coro_text.png in img tag')}
          onLoad={() => console.log('Coro text img tag loaded')}
        />
      </div>
    </div>
  );
};

export default Homepage;

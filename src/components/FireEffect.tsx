import React, { useState, useEffect } from 'react';

interface FireParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

interface FireEffectProps {
  width?: number;
  height?: number;
  particleCount?: number;
  className?: string;
}

export const FireEffect: React.FC<FireEffectProps> = ({ 
  width = 80, 
  height = 100, 
  particleCount = 15,
  className = ""
}) => {
  const [particles, setParticles] = useState<FireParticle[]>([]);

  // Fire colors from red to orange to yellow
  const fireColors = [
    '#ff4444', // Red
    '#ff6644', // Red-orange
    '#ff8844', // Orange
    '#ffaa44', // Orange-yellow
    '#ffcc44', // Yellow-orange
    '#ffdd44', // Yellow
  ];

  // Initialize particles
  useEffect(() => {
    const initialParticles: FireParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push(createParticle(i));
    }
    setParticles(initialParticles);
  }, [particleCount]);

  const createParticle = (id: number): FireParticle => {
    const maxLife = 60 + Math.random() * 40; // 60-100 frames
    return {
      id,
      x: (width * 0.3) + Math.random() * (width * 0.4), // Center area
      y: height - 10 + Math.random() * 10, // Bottom area
      size: 2 + Math.random() * 4,
      opacity: 0.7 + Math.random() * 0.3,
      color: fireColors[Math.floor(Math.random() * fireColors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 1.5, // Slight horizontal drift
        y: -1.5 - Math.random() * 2, // Upward movement
      },
      life: maxLife,
      maxLife,
    };
  };

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          // Update particle position
          const newParticle = {
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            life: particle.life - 1,
            // Fade out as particle ages
            opacity: (particle.life / particle.maxLife) * (0.7 + Math.random() * 0.3),
            // Slight size variation for flickering effect
            size: particle.size + (Math.random() - 0.5) * 0.5,
          };

          // Reset particle if it's dead or moved too far
          if (newParticle.life <= 0 || newParticle.y < -10) {
            return createParticle(particle.id);
          }

          return newParticle;
        });
      });
    }, 50); // ~20 FPS for smooth animation

    return () => clearInterval(interval);
  }, [width, height, particleCount]);

  return (
    <div 
      className={`absolute pointer-events-none ${className}`}
      style={{ width, height }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            filter: 'blur(0.5px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

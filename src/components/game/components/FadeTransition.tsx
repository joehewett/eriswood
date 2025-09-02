import React, { useState, useEffect } from 'react';

export enum FadeState {
  HIDDEN = 'hidden',
  FADING_OUT = 'fading_out',
  BLACK = 'black',
  FADING_IN = 'fading_in',
}

interface FadeTransitionProps {
  isTransitioning: boolean;
  onMidTransition?: () => void; // Called when screen is fully black
  onTransitionComplete?: () => void; // Called when fade in completes
  duration?: number; // Duration of each fade phase in ms
  className?: string;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  isTransitioning,
  onMidTransition,
  onTransitionComplete,
  duration = 400,
  className = ""
}) => {
  const [fadeState, setFadeState] = useState<FadeState>(FadeState.HIDDEN);

  useEffect(() => {
    if (!isTransitioning) {
      setFadeState(FadeState.HIDDEN);
      return;
    }

    // Start fade out
    setFadeState(FadeState.FADING_OUT);

    const fadeOutTimer = setTimeout(() => {
      setFadeState(FadeState.BLACK);
      onMidTransition?.();

      // Start fade in after a brief pause
      const fadeInTimer = setTimeout(() => {
        setFadeState(FadeState.FADING_IN);

        // Complete transition
        const completeTimer = setTimeout(() => {
          setFadeState(FadeState.HIDDEN);
          onTransitionComplete?.();
        }, duration);

        return () => clearTimeout(completeTimer);
      }, 100); // Brief pause while black

      return () => clearTimeout(fadeInTimer);
    }, duration);

    return () => clearTimeout(fadeOutTimer);
  }, [isTransitioning, duration, onMidTransition, onTransitionComplete]);

  if (fadeState === FadeState.HIDDEN) {
    return null;
  }

  const getOpacity = () => {
    switch (fadeState) {
      case FadeState.FADING_OUT:
        return 1;
      case FadeState.BLACK:
        return 1;
      case FadeState.FADING_IN:
        return 0;
      default:
        return 0;
    }
  };

  const getTransition = () => {
    if (fadeState === FadeState.BLACK) {
      return 'none';
    }
    return `opacity ${duration}ms ease-in-out`;
  };

  return (
    <div
      className={`fixed inset-0 bg-black pointer-events-none z-[100] ${className}`}
      style={{
        opacity: getOpacity(),
        transition: getTransition(),
      }}
    />
  );
};

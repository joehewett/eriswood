import React, { useState, useEffect } from 'react';
import { getCharacterImageSrc, gameConfig } from '../utils';
import { FireEffect } from './FireEffect';

interface CharacterSelectProps {
	onSelect: (characterId: 'coro' | 'joe') => void;
}

interface BouncingHedgehogProps {
	alt: string;
	delay: number;
	className?: string;
}

const BouncingHedgehog: React.FC<BouncingHedgehogProps> = ({ alt, delay, className = '' }) => {
	const [currentFrame, setCurrentFrame] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const animationCycle = () => {
			setIsAnimating(true);
			
			// Switch to running frame when bouncing starts
			setTimeout(() => setCurrentFrame(1), 200);
			// Switch back to standing frame in the middle of bounce
			setTimeout(() => setCurrentFrame(0), 600);
			// Switch to running frame again
			setTimeout(() => setCurrentFrame(1), 1000);
			// Back to standing for landing
			setTimeout(() => {
				setCurrentFrame(0);
				setIsAnimating(false);
			}, 1400);
		};

		// Start after initial delay
		const initialTimeout = setTimeout(() => {
			animationCycle();
		}, delay);

		// Repeat every 2 seconds
		const interval = setInterval(animationCycle, 2000);

		return () => {
			clearTimeout(initialTimeout);
			clearInterval(interval);
		};
	}, [delay]);

	return (
		<img
			src={getCharacterImageSrc(currentFrame)}
			alt={alt}
			className={`w-16 h-16 image-render-pixelated transition-transform group-hover:scale-105 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] ${className}`}
			style={{ 
				animation: 'bounce 2s ease-in-out infinite',
				animationDelay: `${delay}ms`
			}}
		/>
	);
};

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect }) => {
	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#060217' }}>
			{/* Background campfire image */}
			<div
				className="absolute border-4 border-[#ab8b65] shadow-[4px_4px_0_0_#000,8px_8px_0_0_#3b2f19] box-border overflow-hidden"
				style={{
					zIndex: 1,
					width: `${gameConfig.FIXED_CANVAS_WIDTH}px`,
					height: `${gameConfig.FIXED_CANVAS_HEIGHT}px`,
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			>
				<img
					src="/game/campfire.webp"
					alt="Campfire Scene"
					className="w-full h-full block select-none"
					draggable={false}
					style={{ imageRendering: 'pixelated' }}
				/>
				
				{/* Eriswood gif at top center */}
				<img
					src="/game/eriswood.gif"
					alt="Eriswood"
					className="absolute top-4 left-1/2 transform -translate-x-1/2 select-none"
					draggable={false}
					style={{ imageRendering: 'pixelated', zIndex: 2 }}
				/>
				
				{/* Fire particle effect positioned at bottom middle */}
				<FireEffect 
					width={120}
					height={150}
					particleCount={40}
					className="bottom-16 left-1/2 transform -translate-x-1/2"
				/>
			</div>

			{/* Character selection overlay */}
			<div className="relative z-10 flex gap-12 md:gap-24">
				<button
					onClick={() => onSelect('coro')}
					className="group flex flex-col items-center cursor-pointer focus:outline-none"
				>
					<BouncingHedgehog alt="Coro" delay={0} />
					<span className="mt-2 text-base font-pixel tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-yellow-200">
						Coro
					</span>
				</button>

				<button
					onClick={() => onSelect('joe')}
					className="group flex flex-col items-center cursor-pointer focus:outline-none"
				>
					<BouncingHedgehog alt="Joe" delay={500} className="filter hue-rotate-[20deg]" />
					<span className="mt-2 text-base font-pixel tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-yellow-200">
						Joe
					</span>
				</button>
			</div>
		</div>
	);
};



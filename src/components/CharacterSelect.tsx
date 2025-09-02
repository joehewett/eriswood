import React from 'react';
import { getCharacterImageSrc, gameConfig } from '../utils';
import { FireEffect } from './FireEffect';

interface CharacterSelectProps {
	onSelect: (characterId: 'coro' | 'joe') => void;
}

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
					<img
						src={getCharacterImageSrc(0)}
						alt="Coro"
						className="w-16 h-16 image-render-pixelated transition-transform group-hover:scale-105 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
					/>
					<span className="mt-2 text-base font-pixel tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-yellow-200">
						Coro
					</span>
				</button>

				<button
					onClick={() => onSelect('joe')}
					className="group flex flex-col items-center cursor-pointer focus:outline-none"
				>
					<img
						src={getCharacterImageSrc(0)}
						alt="Joe"
						className="w-16 h-16 image-render-pixelated filter hue-rotate-[20deg] transition-transform group-hover:scale-105 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
					/>
					<span className="mt-2 text-base font-pixel tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-yellow-200">
						Joe
					</span>
				</button>
			</div>
		</div>
	);
};



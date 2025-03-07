import React, { useState, useRef, useEffect } from 'react';
import { SlotConfig, SlotResult } from '../types';

interface SlotMachineProps {
  config: SlotConfig;
  onSpinComplete: (result: SlotResult) => void;
}

export function SlotMachine({ config, onSpinComplete }: SlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelPositions, setReelPositions] = useState<number[]>(new Array(config.numReels).fill(0));
  const containerRef = useRef<HTMLDivElement>(null);

  const SYMBOL_HEIGHT = 100;
  const REEL_SPEED_MULTIPLIER = 1.2;

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const finalPositions: number[] = [];
    const selectedSymbols: typeof config.reels[0] = [];

    config.reels.forEach((reel, reelIndex) => {
      const randomIndex = Math.floor(Math.random() * reel.length);
      finalPositions[reelIndex] = randomIndex * SYMBOL_HEIGHT;
      selectedSymbols[reelIndex] = reel[randomIndex];
    });

    // Animate each reel with a delay
    finalPositions.forEach((finalPos, reelIndex) => {
      const delay = reelIndex * 200;
      const duration = config.spinDuration + (delay * REEL_SPEED_MULTIPLIER);

      setTimeout(() => {
        animateReel(reelIndex, finalPos, duration);
      }, delay);
    });

    // Check for win condition after all reels stop
    setTimeout(() => {
      setIsSpinning(false);
      const isWin = checkWinCondition(selectedSymbols);
      onSpinComplete({
        combination: selectedSymbols,
        isWin,
      });
    }, config.spinDuration + (config.numReels * 200));
  };

  const animateReel = (reelIndex: number, finalPosition: number, duration: number) => {
    const startTime = performance.now();
    const startPosition = reelPositions[reelIndex];
    const totalSpins = 5; // Number of complete spins before stopping
    const totalDistance = (totalSpins * config.reels[reelIndex].length * SYMBOL_HEIGHT) + finalPosition;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentPosition = startPosition + (totalDistance * easeOut(progress));

      setReelPositions(prev => {
        const newPositions = [...prev];
        newPositions[reelIndex] = currentPosition % (config.reels[reelIndex].length * SYMBOL_HEIGHT);
        return newPositions;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const checkWinCondition = (symbols: typeof config.reels[0]) => {
    // Simple win condition: all symbols match
    return symbols.every(symbol => symbol.id === symbols[0].id);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div 
        ref={containerRef}
        className="flex gap-2 p-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl"
        style={{
          backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {config.reels.map((reel, reelIndex) => (
          <div
            key={reelIndex}
            className="flex-1 h-[300px] bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden"
          >
            <div
              className="transition-transform duration-100"
              style={{
                transform: `translateY(-${reelPositions[reelIndex]}px)`,
              }}
            >
              {[...reel, ...reel, ...reel].map((symbol, symbolIndex) => (
                <div
                  key={`${symbol.id}-${symbolIndex}`}
                  className="h-[100px] flex items-center justify-center bg-white/5 border-b border-white/10"
                >
                  {symbol.imageUrl ? (
                    <img
                      src={symbol.imageUrl}
                      alt={symbol.text}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <span className="text-2xl text-white">{symbol.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className="mt-6 w-full px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform active:scale-95"
      >
        {isSpinning ? 'Spinning...' : 'SPIN!'}
      </button>
    </div>
  );
}
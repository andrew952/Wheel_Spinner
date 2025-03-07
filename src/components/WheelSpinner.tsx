import React, { useRef, useEffect, useState } from 'react';
import { WheelConfig, WheelSegment, SpinResult } from '../types';
import { ChevronDown } from 'lucide-react';

interface WheelSpinnerProps {
  config: WheelConfig;
  onSpinComplete: (result: SpinResult) => void;
}

export function WheelSpinner({ config, onSpinComplete }: WheelSpinnerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [images, setImages] = useState<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    // Preload images
    const loadImages = async () => {
      const newImages = new Map<string, HTMLImageElement>();
      
      for (const segment of config.segments) {
        if (segment.imageUrl && !images.has(segment.id)) {
          const img = new Image();
          img.src = segment.imageUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
          });
          newImages.set(segment.id, img);
        }
      }
      
      setImages(new Map([...images, ...newImages]));
    };

    loadImages();
  }, [config.segments]);

  useEffect(() => {
    drawWheel();
  }, [config, rotation, images]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const segmentAngle = (2 * Math.PI) / config.segments.length;

    config.segments.forEach((segment, index) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        index * segmentAngle + rotation,
        (index + 1) * segmentAngle + rotation
      );
      ctx.closePath();
      
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.stroke();

      // Draw image or text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(index * segmentAngle + segmentAngle / 2 + rotation);
      
      if (segment.imageUrl && images.has(segment.id)) {
        const img = images.get(segment.id)!;
        const imgSize = 40;
        ctx.drawImage(img, radius/2 - imgSize/2, -imgSize/2, imgSize, imgSize);
      } else {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText(segment.text, radius - 20, 6);
      }
      
      ctx.restore();
      ctx.restore();
    });
  };

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spinAngle = Math.random() * 360 + 1440; // At least 4 full rotations
    const duration = config.spinDuration;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentRotation = (spinAngle * easeOut(progress)) * (Math.PI / 180);
      
      setRotation(currentRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalAngle = spinAngle % 360;
        const segmentIndex = Math.floor(
          (360 - finalAngle) / (360 / config.segments.length)
        ) % config.segments.length;
        
        onSpinComplete({
          segmentIndex,
          segment: config.segments[segmentIndex],
        });
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="max-w-full"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        {config.pointerStyle === 'arrow' && (
          <ChevronDown className="w-8 h-8 text-gray-800" />
        )}
      </div>
      <button
        onClick={spin}
        disabled={isSpinning}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpinning ? 'Spinning...' : 'Spin!'}
      </button>
    </div>
  );
}
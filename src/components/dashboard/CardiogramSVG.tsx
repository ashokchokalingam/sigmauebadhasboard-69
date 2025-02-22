
import React, { useEffect, useRef } from 'react';

interface CardiogramSVGProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const CardiogramSVG = ({ riskLevel, color }: CardiogramSVGProps) => {
  const canvasRef = useRef<SVGPathElement>(null);
  
  // Configure wave parameters based on risk level
  const getWaveConfig = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          amplitude: 8.5,
          frequency: 1.75,
          segments: 4,
          speed: 1,
          smoothing: 0.3,
          noise: 2,
          peakHeight: 12
        };
      case 'HIGH':
        return {
          amplitude: 6.5,
          frequency: 1.25,
          segments: 3,
          speed: 0.85,
          smoothing: 0.35,
          noise: 1,
          peakHeight: 10
        };
      case 'MEDIUM':
        return {
          amplitude: 4.5,
          frequency: 0.75,
          segments: 3,
          speed: 0.65,
          smoothing: 0.4,
          noise: 0.5,
          peakHeight: 8
        };
      case 'LOW':
        return {
          amplitude: 2.5,
          frequency: 0.5,
          segments: 2,
          speed: 0.5,
          smoothing: 0.3,
          noise: 0,
          peakHeight: 6
        };
      default:
        return {
          amplitude: 2.5,
          frequency: 0.5,
          segments: 2,
          speed: 0.5,
          smoothing: 0.3,
          noise: 0,
          peakHeight: 6
        };
    }
  };

  useEffect(() => {
    const path = canvasRef.current;
    if (!path) return;

    const config = getWaveConfig(riskLevel);
    let frame: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = ((timestamp - startTime) * config.speed) % 1000;
      
      // Create a more natural-looking heartbeat pattern
      let d = `M 0 10`;
      const points: [number, number][] = [];
      const width = 60;
      const step = width / 20; // More points for smoother curves
      
      for (let x = 0; x <= width; x += step) {
        const phase = (progress / 1000) * Math.PI * 2;
        let y = 10;
        
        // Create the characteristic QRS complex shape
        const normalizedX = x / width;
        if (normalizedX > 0.3 && normalizedX < 0.7) {
          const peakPosition = 0.5;
          const distanceFromPeak = Math.abs(normalizedX - peakPosition);
          if (distanceFromPeak < 0.1) {
            // Create sharp peak
            y -= Math.cos(distanceFromPeak * Math.PI * 5) * config.peakHeight;
          } else {
            // Create baseline waves
            y += Math.sin(x * config.frequency + phase) * config.amplitude;
          }
        } else {
          // Baseline waves
          y += Math.sin(x * config.frequency + phase) * (config.amplitude * 0.5);
        }
        
        // Add subtle noise for more realistic appearance
        if (config.noise > 0) {
          y += (Math.random() - 0.5) * config.noise;
        }
        
        points.push([x, y]);
      }
      
      // Create smooth curve through points
      points.forEach((point, i) => {
        if (i === 0) {
          d += ` M ${point[0]} ${point[1]}`;
        } else {
          const prevPoint = points[i - 1];
          const nextPoint = points[i + 1] || point;
          
          // Use cubic bezier curves for smoother transitions
          const smoothing = config.smoothing;
          const cpx1 = prevPoint[0] + (point[0] - prevPoint[0]) * smoothing;
          const cpy1 = prevPoint[1];
          const cpx2 = point[0] - (nextPoint[0] - point[0]) * smoothing;
          const cpy2 = point[1];
          
          d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point[0]} ${point[1]}`;
        }
      });

      path.setAttribute('d', d);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [riskLevel]);

  const getGlowOpacity = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return '0.4';
      case 'HIGH':
        return '0.35';
      case 'MEDIUM':
        return '0.3';
      default:
        return '0.25';
    }
  };

  return (
    <svg
      width="60"
      height="20"
      viewBox="0 0 60 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`opacity-60 hover:opacity-100 transition-opacity duration-300 
        ${riskLevel === 'CRITICAL' ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`}
    >
      <defs>
        <linearGradient id={`line-gradient-${riskLevel}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
        <filter id="glow" x="-2" y="-2" width="64" height="24">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
          <feDropShadow 
            dx="0" 
            dy="0" 
            stdDeviation="2" 
            floodColor={color} 
            floodOpacity={getGlowOpacity()}
          />
        </filter>
      </defs>
      <path
        ref={canvasRef}
        stroke={`url(#line-gradient-${riskLevel})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
    </svg>
  );
};

export default CardiogramSVG;

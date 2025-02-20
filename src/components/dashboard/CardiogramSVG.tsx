
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
      case 'LOW':
        return {
          amplitude: 2.5,
          frequency: 0.5,
          segments: 2,
          speed: 0.5,
          smoothing: 0.3
        };
      case 'MEDIUM':
        return {
          amplitude: 4.5,
          frequency: 0.75,
          segments: 3,
          speed: 0.65,
          smoothing: 0.4
        };
      case 'HIGH':
        return {
          amplitude: 6.5,
          frequency: 1.25,
          segments: 3,
          speed: 0.85,
          smoothing: 0.35
        };
      case 'CRITICAL':
        return {
          amplitude: 8.5,
          frequency: 1.75,
          segments: 4,
          speed: 1,
          smoothing: 0.3
        };
      default:
        return {
          amplitude: 2.5,
          frequency: 0.5,
          segments: 2,
          speed: 0.5,
          smoothing: 0.3
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
      
      let d = `M 0 10`;
      const width = 60;
      const segments = config.segments * 2;
      const step = width / segments;
      const points: [number, number][] = [];
      
      for (let i = 0; i <= segments; i++) {
        const x = i * step;
        const phase = (progress / 1000) * Math.PI * 2;
        let y = 10 + Math.sin(i * config.frequency + phase) * config.amplitude;
        
        if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
          const noise = (Math.random() - 0.5) * (riskLevel === 'CRITICAL' ? 2 : 1);
          y += noise;
        }
        
        points.push([x, y]);
      }
      
      points.forEach((point, i) => {
        if (i === 0) {
          d += ` L ${point[0]} ${point[1]}`;
        } else {
          const prev = points[i - 1];
          const curr = point;
          
          if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
            d += ` L ${curr[0]} ${curr[1]}`;
          } else {
            const smoothing = config.smoothing;
            const cpx1 = prev[0] + (curr[0] - prev[0]) * smoothing;
            const cpy1 = prev[1];
            const cpx2 = curr[0] - (curr[0] - prev[0]) * smoothing;
            const cpy2 = curr[1];
            
            d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr[0]} ${curr[1]}`;
          }
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

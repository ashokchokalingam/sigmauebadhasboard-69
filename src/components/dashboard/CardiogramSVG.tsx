
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
          amplitude: 2,
          frequency: 0.5,
          segments: 2,
          speed: 0.5
        };
      case 'MEDIUM':
        return {
          amplitude: 4,
          frequency: 1,
          segments: 3,
          speed: 0.75
        };
      case 'HIGH':
        return {
          amplitude: 6,
          frequency: 1.5,
          segments: 3,
          speed: 1
        };
      case 'CRITICAL':
        return {
          amplitude: 8,
          frequency: 2,
          segments: 4,
          speed: 1.25
        };
      default:
        return {
          amplitude: 2,
          frequency: 0.5,
          segments: 2,
          speed: 0.5
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
      
      // Generate wave path
      let d = `M 0 10`;
      const width = 60;
      const segments = config.segments * 2; // Double for complete waves
      const step = width / segments;
      
      for (let i = 0; i <= segments; i++) {
        const x = i * step;
        const phase = (progress / 1000) * Math.PI * 2;
        const y = 10 + Math.sin(i * config.frequency + phase) * config.amplitude;
        
        if (i === 0) {
          d += ` L ${x} ${y}`;
        } else {
          const cpx1 = x - step / 2;
          const cpy1 = y;
          d += ` S ${cpx1} ${cpy1} ${x} ${y}`;
        }
      }

      path.setAttribute('d', d);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [riskLevel]);

  return (
    <svg
      width="60"
      height="20"
      viewBox="0 0 60 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-60 hover:opacity-100 transition-opacity duration-300"
    >
      <path
        ref={canvasRef}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      <defs>
        <filter id="glow" x="-2" y="-2" width="64" height="24">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
};

export default CardiogramSVG;

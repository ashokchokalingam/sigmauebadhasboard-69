
import React, { useEffect, useRef } from 'react';

interface SparklineProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

// Generate sample data based on risk level (in real implementation, this would come from actual historical data)
const generateTrendData = (riskLevel: string, points: number = 20): number[] => {
  const baseValue = {
    'LOW': 25,
    'MEDIUM': 75,
    'HIGH': 125,
    'CRITICAL': 175
  }[riskLevel] || 25;

  const volatility = {
    'LOW': 5,
    'MEDIUM': 15,
    'HIGH': 25,
    'CRITICAL': 35
  }[riskLevel] || 5;

  return Array.from({ length: points }, (_, i) => {
    const time = i / (points - 1);
    const trend = Math.sin(time * Math.PI * 2) * (volatility / 2);
    const noise = (Math.random() - 0.5) * volatility;
    return Math.max(0, Math.min(200, baseValue + trend + noise));
  });
};

// Normalize points to fit in the SVG viewport
const normalizePoints = (points: number[], height: number): number[] => {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min;
  return points.map(p => height - ((p - min) / range) * height);
};

const Sparkline = ({ riskLevel, color }: SparklineProps) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    // Generate and normalize data
    const data = generateTrendData(riskLevel);
    const normalizedData = normalizePoints(data, 16); // Height minus padding

    // Create SVG path
    const width = 60;
    const pointSpacing = width / (data.length - 1);
    
    let pathD = `M 0 ${normalizedData[0]}`;
    
    // Create smooth curve through points
    for (let i = 1; i < normalizedData.length; i++) {
      const x = i * pointSpacing;
      const y = normalizedData[i];
      
      if (i === 1) {
        pathD += ` L ${x} ${y}`;
      } else {
        const xPrev = (i - 1) * pointSpacing;
        const yPrev = normalizedData[i - 1];
        const cx1 = (xPrev + x) / 2;
        const cy1 = yPrev;
        const cx2 = (xPrev + x) / 2;
        const cy2 = y;
        pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
      }
    }

    path.setAttribute('d', pathD);
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
        ref={pathRef}
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

export default Sparkline;

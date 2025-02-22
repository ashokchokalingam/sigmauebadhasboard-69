
import React from 'react';

interface RiskSparklineProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const RiskSparkline = ({ riskLevel, color }: RiskSparklineProps) => {
  const getSparklineConfig = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { points: [40, 60, 80, 100], pulseSpeed: '1.5s' };
      case 'HIGH':
        return { points: [30, 50, 70, 75], pulseSpeed: '2s' };
      case 'MEDIUM':
        return { points: [20, 35, 45, 50], pulseSpeed: '2.5s' };
      case 'LOW':
        return { points: [10, 20, 25, 25], pulseSpeed: '3s' };
      default:
        return { points: [10, 20, 25, 25], pulseSpeed: '3s' };
    }
  };

  const config = getSparklineConfig(riskLevel);
  const maxHeight = 16; // Graph height

  // Create path data
  const pathPoints = config.points.map((point, index) => {
    const x = 5 + ((50 / (config.points.length - 1)) * index);
    const y = 20 - ((point / 100) * maxHeight);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

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
      className={`opacity-60 hover:opacity-100 transition-opacity duration-300`}
    >
      <defs>
        <linearGradient id={`sparkline-gradient-${riskLevel}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
        <filter id="sparkline-glow">
          <feGaussianBlur stdDeviation="1" />
          <feComposite in="SourceGraphic" />
          <feDropShadow 
            dx="0" 
            dy="0" 
            stdDeviation="1.5" 
            floodColor={color} 
            floodOpacity={getGlowOpacity()} 
          />
        </filter>
      </defs>

      {/* Background grid */}
      {[0, 1, 2, 3].map((line) => (
        <line
          key={line}
          x1="5"
          y1={6 + (line * 4)}
          x2="55"
          y2={6 + (line * 4)}
          stroke="rgba(88, 86, 214, 0.1)"
          strokeWidth="0.5"
        />
      ))}

      {/* Area under the line */}
      <path
        d={`${pathPoints} L 55 20 L 5 20 Z`}
        fill={`url(#sparkline-gradient-${riskLevel})`}
        opacity="0.2"
      />

      {/* Main line */}
      <path
        d={pathPoints}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter="url(#sparkline-glow)"
        className="animate-pulse"
        style={{
          animationDuration: config.pulseSpeed,
        }}
      />

      {/* Current value dot */}
      <circle
        cx="55"
        cy={20 - ((config.points[config.points.length - 1] / 100) * maxHeight)}
        r="2"
        fill={color}
        filter="url(#sparkline-glow)"
        className="animate-pulse"
        style={{
          animationDuration: config.pulseSpeed,
        }}
      />
    </svg>
  );
};

export default RiskSparkline;

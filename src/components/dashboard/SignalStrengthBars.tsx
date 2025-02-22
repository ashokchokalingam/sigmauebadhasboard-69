
import React from 'react';

interface SignalStrengthBarsProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const SignalStrengthBars = ({ riskLevel, color }: SignalStrengthBarsProps) => {
  const getBarsConfig = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { activeBars: 4, animationDuration: '1.5s' };
      case 'HIGH':
        return { activeBars: 3, animationDuration: '2s' };
      case 'MEDIUM':
        return { activeBars: 2, animationDuration: '2.5s' };
      case 'LOW':
        return { activeBars: 1, animationDuration: '3s' };
      default:
        return { activeBars: 1, animationDuration: '3s' };
    }
  };

  const config = getBarsConfig(riskLevel);
  const totalBars = 4;

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
        <linearGradient id={`bar-gradient-${riskLevel}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" />
          <feComposite in="SourceGraphic" />
          <feDropShadow 
            dx="0" 
            dy="0" 
            stdDeviation="1" 
            floodColor={color} 
            floodOpacity={getGlowOpacity()} 
          />
        </filter>
      </defs>
      
      <g>
        {[...Array(totalBars)].map((_, index) => {
          const barHeight = 6 + (index * 4);
          const barWidth = 8;
          const gap = 4;
          const x = 10 + (index * (barWidth + gap));
          const y = 20 - barHeight;
          const isActive = index < config.activeBars;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={1}
              fill={isActive ? `url(#bar-gradient-${riskLevel})` : 'rgba(88, 86, 214, 0.1)'}
              filter={isActive ? 'url(#glow)' : 'none'}
              className={isActive ? 'animate-pulse' : ''}
              style={{
                animationDuration: config.animationDuration,
                transformOrigin: 'bottom',
              }}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default SignalStrengthBars;


import React from 'react';

interface RiskMeterProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

const RiskMeter = ({ riskLevel, color }: RiskMeterProps) => {
  const getMeterConfig = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { fill: 100, pulseSpeed: '1.5s' };
      case 'HIGH':
        return { fill: 75, pulseSpeed: '2s' };
      case 'MEDIUM':
        return { fill: 50, pulseSpeed: '2.5s' };
      case 'LOW':
        return { fill: 25, pulseSpeed: '3s' };
      default:
        return { fill: 25, pulseSpeed: '3s' };
    }
  };

  const config = getMeterConfig(riskLevel);

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
        <linearGradient id={`meter-gradient-${riskLevel}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
        <filter id="meter-glow">
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

      {/* Background track */}
      <rect
        x="5"
        y="8"
        width="50"
        height="4"
        rx="2"
        fill="rgba(88, 86, 214, 0.1)"
      />

      {/* Tick marks */}
      {[0, 1, 2, 3].map((tick) => (
        <rect
          key={tick}
          x={5 + (tick * 16.67)}
          y="6"
          width="1"
          height="8"
          fill="rgba(88, 86, 214, 0.2)"
        />
      ))}

      {/* Animated fill */}
      <rect
        x="5"
        y="8"
        width={(50 * config.fill) / 100}
        height="4"
        rx="2"
        fill={`url(#meter-gradient-${riskLevel})`}
        filter="url(#meter-glow)"
        className="animate-pulse"
        style={{
          animationDuration: config.pulseSpeed,
          transformOrigin: 'left',
        }}
      />

      {/* Sliding indicator */}
      <circle
        cx={5 + ((50 * config.fill) / 100)}
        cy="10"
        r="3"
        fill={color}
        filter="url(#meter-glow)"
        className="animate-pulse"
        style={{
          animationDuration: config.pulseSpeed,
        }}
      />
    </svg>
  );
};

export default RiskMeter;

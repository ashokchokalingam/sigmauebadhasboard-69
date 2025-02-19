
import React from "react";
import { cn } from "@/lib/utils";

interface EntityCardRiskGaugeProps {
  riskScore: string | null;
}

const EntityCardRiskGauge = ({ riskScore }: EntityCardRiskGaugeProps) => {
  const score = riskScore ? parseInt(riskScore) : 0;
  const rotation = Math.min((score / 200) * 180, 180); // Map 0-200 to 0-180 degrees

  const getGradientColors = (score: number) => {
    if (score >= 200) return ["#28c76f", "#F97316", "#ea384c"];
    if (score >= 100) return ["#28c76f", "#F97316", "#ea384c"];
    if (score >= 50) return ["#28c76f", "#F97316"];
    return ["#28c76f"];
  };

  const getRiskColor = (score: number) => {
    if (score >= 200) return "#ea384c";
    if (score >= 100) return "#ea384c";
    if (score >= 50) return "#F97316";
    return "#28c76f";
  };

  return (
    <div className="relative w-16 h-16">
      {/* Background Circle */}
      <svg 
        className="w-full h-full -rotate-90 transform"
        viewBox="0 0 100 100"
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {getGradientColors(score).map((color, index, array) => (
              <stop 
                key={index}
                offset={`${(index / (array.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="8"
          className="opacity-20"
        />

        {/* Colored Progress */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#riskGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(rotation / 180) * 282.7} 282.7`}
          className="transition-all duration-500"
        />

        {/* Center Point */}
        <circle
          cx="50"
          cy="50"
          r="3"
          fill={getRiskColor(score)}
          className="transition-colors duration-500"
        />

        {/* Needle */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="10"
          stroke={getRiskColor(score)}
          strokeWidth="2"
          className="transition-all duration-500 origin-center"
          transform={`rotate(${rotation} 50 50)`}
        />
      </svg>

      {/* Risk Score Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "text-xs font-mono font-bold",
          getRiskColor(score)
        )}>
          {riskScore || '0'}
        </span>
      </div>
    </div>
  );
};

export default EntityCardRiskGauge;

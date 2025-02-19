
import React from "react";
import { cn } from "@/lib/utils";

interface EntityCardRiskGaugeProps {
  riskScore: string | null;
}

const EntityCardRiskGauge = ({ riskScore }: EntityCardRiskGaugeProps) => {
  const score = riskScore ? parseInt(riskScore) : 0;

  const getRiskLevel = (score: number) => {
    if (score >= 150) return { 
      level: "HIGH", 
      color: "#ea384c",
      textGlow: "text-shadow-[0_0_10px_rgba(234,56,76,0.5)]",
      bgGlow: "shadow-[0_0_15px_rgba(234,56,76,0.2)]",
      bgColor: "bg-gradient-to-r from-[#ea384c]/10 to-transparent",
      pulsing: true
    };
    if (score >= 80) return { 
      level: "MEDIUM", 
      color: "#F97316",
      textGlow: "text-shadow-[0_0_10px_rgba(249,115,22,0.5)]",
      bgGlow: "shadow-[0_0_15px_rgba(249,115,22,0.2)]",
      bgColor: "bg-gradient-to-r from-[#F97316]/10 to-transparent",
      pulsing: false
    };
    return { 
      level: "LOW", 
      color: "#28c76f",
      textGlow: "text-shadow-[0_0_10px_rgba(40,199,111,0.5)]",
      bgGlow: "shadow-[0_0_15px_rgba(40,199,111,0.2)]",
      bgColor: "bg-gradient-to-r from-[#28c76f]/10 to-transparent",
      pulsing: false
    };
  };

  const { level, color, textGlow, bgGlow, bgColor, pulsing } = getRiskLevel(score);

  return (
    <div className="flex items-center gap-3 relative">
      <div className="flex flex-col gap-0.5">
        <span 
          className={cn(
            "text-xs tracking-wide transition-colors duration-300",
            textGlow
          )}
          style={{ color }}
        >
          Risk Level
        </span>
        <span 
          className={cn(
            "text-xs font-medium tracking-wide transition-colors duration-300",
            textGlow
          )}
          style={{ color }}
        >
          {level}
        </span>
      </div>

      {/* Cardiogram SVG */}
      <div className="relative w-12 h-5 overflow-hidden opacity-40">
        <svg 
          className={cn(
            "w-[200%] h-full animate-cardiogram transition-opacity duration-300",
            pulsing && "animate-pulse"
          )}
          viewBox="0 0 400 100" 
          preserveAspectRatio="none"
          style={{ color }}
        >
          <path
            d="M0,50 L60,50 L80,20 L100,80 L120,50 L180,50 L200,20 L220,80 L240,50 L300,50 L320,20 L340,80 L360,50 L400,50"
            className="stroke-current fill-none stroke-[2]"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div 
        className={cn(
          "font-mono font-bold text-2xl px-3 py-1 rounded",
          "transition-all duration-300 backdrop-blur-sm",
          "border border-white/5",
          bgColor,
          bgGlow,
          pulsing && "animate-pulse"
        )}
        style={{ color }}
      >
        {score.toFixed(1)}
      </div>
    </div>
  );
};

export default EntityCardRiskGauge;

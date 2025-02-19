
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
      bgColor: "bg-gradient-to-r from-[#ea384c]/20 to-[#ea384c]/10",
    };
    if (score >= 80) return { 
      level: "MEDIUM", 
      color: "#F97316",
      bgColor: "bg-gradient-to-r from-[#F97316]/20 to-[#F97316]/10",
    };
    return { 
      level: "LOW", 
      color: "#28c76f",
      bgColor: "bg-gradient-to-r from-[#28c76f]/20 to-[#28c76f]/10",
    };
  };

  const { level, color } = getRiskLevel(score);

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-0.5">
        <span 
          className="text-xs tracking-wide"
          style={{ color }}
        >
          Risk Level
        </span>
        <span 
          className="text-xs font-medium tracking-wide"
          style={{ color }}
        >
          {level}
        </span>
      </div>

      {/* Cardiogram SVG */}
      <div className="relative w-12 h-5 overflow-hidden opacity-40">
        <svg 
          className="w-[200%] h-full animate-cardiogram"
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
        className="font-mono font-bold text-2xl px-3 py-1 rounded bg-black/25"
        style={{ color }}
      >
        {score.toFixed(1)}
      </div>
    </div>
  );
};

export default EntityCardRiskGauge;

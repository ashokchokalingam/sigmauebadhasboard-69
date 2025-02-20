
import React from "react";
import { cn } from "@/lib/utils";

interface EntityCardRiskGaugeProps {
  riskScore: string | null;
}

const EntityCardRiskGauge = ({ riskScore }: EntityCardRiskGaugeProps) => {
  const score = riskScore ? parseFloat(riskScore) : 0;

  const getRiskLevel = (score: number) => {
    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "#ea384c",
      textColor: "text-[#ea384c]",
      underlineGradient: "bg-gradient-to-r from-[#ea384c]/50 to-transparent"
    };
    if (score >= 80) return { 
      level: "HIGH", 
      color: "#F97316",
      textColor: "text-[#F97316]",
      underlineGradient: "bg-gradient-to-r from-[#F97316]/50 to-transparent"
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "#F97316",
      textColor: "text-[#F97316]",
      underlineGradient: "bg-gradient-to-r from-[#F97316]/50 to-transparent"
    };
    return { 
      level: "LOW", 
      color: "#28c76f",
      textColor: "text-[#28c76f]",
      underlineGradient: "bg-gradient-to-r from-[#28c76f]/50 to-transparent"
    };
  };

  const { level, textColor, underlineGradient } = getRiskLevel(score);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col">
        <span className={cn(
          "text-xs font-medium uppercase",
          textColor
        )}>
          {level}
        </span>
        <div className={cn(
          "h-0.5 w-12 mt-0.5",
          underlineGradient
        )} />
      </div>
      <div className={cn(
        "font-mono font-bold tracking-wider",
        textColor
      )}>
        {score.toFixed(1)}
      </div>
    </div>
  );
};

export default EntityCardRiskGauge;

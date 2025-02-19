
import React from "react";
import { cn } from "@/lib/utils";

interface EntityCardRiskLevelProps {
  riskScore: string | null;
  isHighRisk: boolean;
}

const EntityCardRiskLevel = ({ riskScore, isHighRisk }: EntityCardRiskLevelProps) => {
  const getRiskLevel = (score: string | null) => {
    if (!score) return { level: "N/A", color: "text-gray-400" };
    const numScore = parseInt(score);
    if (numScore >= 200) return { 
      level: "CRITICAL", 
      color: "text-[#ea384c]",
      levelColor: "from-[#ea384c] to-[#ff6b81]" 
    };
    if (numScore >= 100) return { 
      level: "HIGH", 
      color: "text-[#ff9f43]",
      levelColor: "from-[#ff9f43] to-[#ffc085]"
    };
    if (numScore >= 50) return { 
      level: "MEDIUM", 
      color: "text-[#9b87f5]",
      levelColor: "from-[#9b87f5] to-[#D6BCFA]"
    };
    return { 
      level: "LOW", 
      color: "text-[#28c76f]",
      levelColor: "from-[#28c76f] to-[#48da89]"
    };
  };

  const { level, color, levelColor } = getRiskLevel(riskScore);

  return (
    <div className="flex flex-col items-end">
      <span className={cn(
        "text-sm font-medium uppercase tracking-wide",
        "text-[#9b87f5]"
      )}>
        Risk Level
      </span>
      <span className={cn(
        "text-xs font-bold mt-0.5 uppercase tracking-wider",
        "bg-gradient-to-r bg-clip-text text-transparent",
        levelColor
      )}>
        {level}
      </span>
    </div>
  );
};

export default EntityCardRiskLevel;

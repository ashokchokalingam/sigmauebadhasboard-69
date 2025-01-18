import React from "react";
import { cn } from "@/lib/utils";

interface EntityCardRiskLevelProps {
  riskScore: string | null;
  isHighRisk: boolean;
}

const EntityCardRiskLevel = ({ riskScore, isHighRisk }: EntityCardRiskLevelProps) => {
  const getRiskLevel = (score: string | null) => {
    if (!score) return "";
    const numScore = parseInt(score);
    if (numScore >= 200) return "critical";
    if (numScore >= 50) return "high";
    return "low";
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className={cn(
          "text-[#9b87f5] font-medium text-2xl",
          isHighRisk && "animate-pulse"
        )}>
          Risk Level
        </span>
        <span className={cn(
          "text-xl font-medium mt-1 text-[#D6BCFA]",
          isHighRisk && "animate-pulse"
        )}>
          {getRiskLevel(riskScore)}
        </span>
      </div>
    </div>
  );
};

export default EntityCardRiskLevel;
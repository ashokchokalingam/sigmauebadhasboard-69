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
    if (numScore >= 200) return "CRITICAL";
    if (numScore >= 50) return "HIGH";
    if (numScore >= 30) return "MEDIUM";
    if (numScore >= 10) return "LOW";
    return "INFORMATIONAL";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <span className={cn(
          "text-[#9b87f5] font-medium text-sm uppercase tracking-wide",
          isHighRisk && "animate-pulse"
        )}>
          Risk Level
        </span>
        <span className={cn(
          "text-xs font-medium mt-0.5 text-[#D6BCFA] uppercase tracking-wide",
          isHighRisk && "animate-pulse"
        )}>
          {getRiskLevel(riskScore)}
        </span>
      </div>
    </div>
  );
};

export default EntityCardRiskLevel;

import React from "react";
import { cn } from "@/lib/utils";
import { getRiskScoreColor } from "./utils/colorUtils";

interface EntityCardRiskLevelProps {
  riskScore: string | null;
  isHighRisk: boolean;
}

const EntityCardRiskLevel = ({ riskScore, isHighRisk }: EntityCardRiskLevelProps) => {
  const getRiskLevel = (score: string | null) => {
    if (!score) return { level: "N/A", color: "text-[#0FA0CE]" };
    const numScore = parseInt(score);
    if (numScore >= 200) return { 
      level: "CRITICAL", 
      color: "text-[#ea384c]",
    };
    if (numScore >= 100) return { 
      level: "HIGH", 
      color: "text-[#ea384c]",
    };
    if (numScore >= 50) return { 
      level: "MEDIUM", 
      color: "text-[#F97316]",
    };
    return { 
      level: "LOW", 
      color: "text-[#28c76f]",
    };
  };

  const { level, color } = getRiskLevel(riskScore);

  return (
    <div className="flex flex-col items-end">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Risk Level
      </span>
      <span className={cn(
        "text-xs font-bold mt-0.5 uppercase tracking-wider",
        color
      )}>
        {level}
      </span>
    </div>
  );
};

export default EntityCardRiskLevel;

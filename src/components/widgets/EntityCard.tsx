
import React from "react";
import { Monitor, User } from "lucide-react";
import RiskLevelIndicator from "./RiskLevelIndicator";
import WaveformDisplay from "./WaveformDisplay";
import RiskScoreDisplay from "./RiskScoreDisplay";
import { RiskyEntity } from "./types";

interface EntityCardProps {
  entity: RiskyEntity;
  entityType: 'computer' | 'userOrigin' | 'userImpacted';
  onClick: () => void;
}

const EntityCard = ({ entity, entityType, onClick }: EntityCardProps) => {
  const isComputer = entityType === 'computer';
  const Icon = isComputer ? Monitor : User;
  const entityName = isComputer ? entity.computer : entity.user;

  const getRiskLevel = (score: number): { 
    level: string; 
    color: string;
    textColor: string; 
    bgColor: string;
    lineColor: string;
    barWidth: number;
    glowColor: string;
  } => {
    // Calculate relative width based on risk level
    const getBarWidth = (score: number): number => {
      if (score >= 150) return Math.min((score / 200) * 100, 100); // CRITICAL
      if (score >= 100) return (score / 150) * 75; // HIGH
      if (score >= 50) return (score / 100) * 50; // MEDIUM
      return (score / 50) * 25; // LOW
    };

    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "#FF3B30", // Brighter red for better visibility
      textColor: "text-[#FF3B30]",
      bgColor: "bg-[#FF3B30]/10",
      lineColor: "bg-[#FF3B30]",
      barWidth: getBarWidth(score),
      glowColor: "#FF5252"
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "#FF9500", // Warmer orange
      textColor: "text-[#FF9500]",
      bgColor: "bg-[#FF9500]/10",
      lineColor: "bg-[#FF9500]",
      barWidth: getBarWidth(score),
      glowColor: "#FFB340"
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "#FFB340", // Warmer yellow
      textColor: "text-[#FFB340]",
      bgColor: "bg-[#FFB340]/10",
      lineColor: "bg-[#FFB340]",
      barWidth: getBarWidth(score),
      glowColor: "#FFD484"
    };
    return { 
      level: "LOW", 
      color: "#34C759", // Brighter green
      textColor: "text-[#34C759]",
      bgColor: "bg-[#34C759]/10",
      lineColor: "bg-[#34C759]",
      barWidth: getBarWidth(score),
      glowColor: "#4ADE80"
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, color, textColor, bgColor, lineColor, barWidth, glowColor } = getRiskLevel(riskScore);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 rounded-lg
        bg-[#0A0B0F] hover:bg-[#12131A]
        border border-[#5856D6]/20 hover:border-[#5856D6]/30
        transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:shadow-[#5856D6]/5"
    >
      <div className="flex items-center gap-3 flex-[0_0_40%]">
        <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center
          border border-[#5856D6]/10`}>
          <Icon className={`w-4 h-4 ${textColor}`} />
        </div>
        
        <div className="flex flex-col min-w-[120px] gap-0.5">
          <span className="font-mono text-sm text-[#D6BCFA] font-medium hover:text-white truncate max-w-[180px]">
            {entityName}
          </span>
          <span className="text-xs text-[#9b87f5]/60">
            {entity.unique_title_count} unique anomalies
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex flex-col items-start mr-2">
          <span className="text-[11px] uppercase text-[#9b87f5]/60 mb-0.5">Risk Level</span>
          <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
            {level}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="opacity-70 hover:opacity-100 transition-opacity">
            <WaveformDisplay level={level as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} color={color} />
          </div>

          <RiskScoreDisplay 
            score={riskScore}
            textColor={textColor}
            lineColor={lineColor}
            barWidth={barWidth}
            glowColor={glowColor}
            color={color}
          />
        </div>
      </div>
    </div>
  );
};

export default EntityCard;

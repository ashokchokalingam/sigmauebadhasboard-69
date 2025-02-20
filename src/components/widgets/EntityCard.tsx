
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
      color: "#D32F2F", // Updated to new deeper red
      textColor: "text-[#D32F2F]",
      bgColor: "bg-[#D32F2F]/5",
      lineColor: "bg-[#D32F2F]",
      barWidth: getBarWidth(score),
      glowColor: "#FF5252" // Lighter red for glow
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "#FF5722", // Updated to brighter orange
      textColor: "text-[#FF5722]",
      bgColor: "bg-[#FF5722]/5",
      lineColor: "bg-[#FF5722]",
      barWidth: getBarWidth(score),
      glowColor: "#FF7043" // Lighter orange for glow
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "#FF9800", // Updated to deep orange
      textColor: "text-[#FF9800]",
      bgColor: "bg-[#FF9800]/5",
      lineColor: "bg-[#FF9800]",
      barWidth: getBarWidth(score),
      glowColor: "#FFB74D" // Lighter orange for glow
    };
    return { 
      level: "LOW", 
      color: "#4CAF50", // Kept existing green
      textColor: "text-[#4CAF50]",
      bgColor: "bg-[#4CAF50]/5",
      lineColor: "bg-[#4CAF50]",
      barWidth: getBarWidth(score),
      glowColor: "#81C784" // Lighter green for glow
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, color, textColor, bgColor, lineColor, barWidth, glowColor } = getRiskLevel(riskScore);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-lg h-[84px]
        bg-[#0A0B0F] hover:bg-[#12131A]
        border border-[#5856D6]/30 hover:border-[#5856D6]/50
        transition-colors duration-300 cursor-pointer
        shadow-sm hover:shadow-md hover:shadow-[#5856D6]/10"
    >
      <div className="flex items-center gap-3 flex-[0_0_45%]">
        <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center
          border border-[#5856D6]/20`}>
          <Icon className={`w-4 h-4 ${textColor}`} />
        </div>
        
        <div className="flex flex-col min-w-[120px] gap-1">
          <span className="font-mono text-sm text-[#D6BCFA] font-medium hover:text-white truncate max-w-[200px]">
            {entityName}
          </span>
          <span className="text-xs text-[#9b87f5]/70">
            {entity.unique_title_count} unique anomalies
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <RiskLevelIndicator level={level} textColor={textColor} />
        <WaveformDisplay level={level as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} color={color} />
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
  );
};

export default EntityCard;

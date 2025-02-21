import React from "react";
import { RiskyEntity } from "./types";
import { cn } from "@/lib/utils";
import WaveformDisplay from "./WaveformDisplay";
import RiskScoreDisplay from "./RiskScoreDisplay";
import EntityCardInfo from "./EntityCardInfo";
import EntityCardExpanded from "./EntityCardExpanded";
import { Monitor, User, ArrowUpIcon, ArrowDownIcon, Clock } from "lucide-react";

interface EntityCardProps {
  entity: RiskyEntity;
  entityType: 'computer' | 'userOrigin' | 'userImpacted';
  onClick: () => void;
  isExpanded: boolean;
}

const EntityCard = ({ entity, entityType, onClick, isExpanded }: EntityCardProps) => {
  const riskScore = parseFloat(entity.cumulative_risk_score);

  const getRiskLevel = (score: number): { 
    level: string; 
    color: string;
    textColor: string; 
    bgColor: string;
    lineColor: string;
    barWidth: number;
    glowColor: string;
    trend: 'up' | 'down' | null;
  } => {
    const getBarWidth = (score: number): number => {
      if (score >= 150) return Math.min((score / 200) * 100, 100);
      if (score >= 100) return (score / 150) * 75;
      if (score >= 50) return (score / 100) * 50;
      return (score / 50) * 25;
    };

    const trend = typeof entity.risk_trend === 'number'
      ? entity.risk_trend > 0 
        ? 'up' 
        : 'down'
      : null;

    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "#FF3B30",
      textColor: "text-[#FF3B30]",
      bgColor: "bg-[#FF3B30]/10",
      lineColor: "bg-[#FF3B30]",
      barWidth: getBarWidth(score),
      glowColor: "#FF5252",
      trend
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "#FF9500",
      textColor: "text-[#FF9500]",
      bgColor: "bg-[#FF9500]/10",
      lineColor: "bg-[#FF9500]",
      barWidth: getBarWidth(score),
      glowColor: "#FFB340",
      trend
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "#FFB340",
      textColor: "text-[#FFB340]",
      bgColor: "bg-[#FFB340]/10",
      lineColor: "bg-[#FFB340]",
      barWidth: getBarWidth(score),
      glowColor: "#FFD484",
      trend
    };
    return { 
      level: "LOW", 
      color: "#34C759",
      textColor: "text-[#34C759]",
      bgColor: "bg-[#34C759]/10",
      lineColor: "bg-[#34C759]",
      barWidth: getBarWidth(score),
      glowColor: "#4ADE80",
      trend
    };
  };

  const { level, color, textColor, bgColor, lineColor, barWidth, glowColor, trend } = getRiskLevel(riskScore);

  return (
    <div 
      onClick={onClick}
      className={cn(
        "w-full mb-2 cursor-pointer",
        isExpanded && "bg-[#0A0B0F] rounded-lg border border-[#5856D6]/20"
      )}
    >
      <div className={cn(
        "flex items-center justify-between px-4 py-3 rounded-lg",
        !isExpanded && "bg-[#0A0B0F] border border-[#5856D6]/20",
        "hover:bg-[#12131A]",
        "transition-all duration-300",
        "hover:shadow-lg hover:shadow-[#5856D6]/5",
        isExpanded && "border-b border-[#5856D6]/20"
      )}>
        <EntityCardInfo 
          entityType={entityType}
          entity={entity}
          textColor={textColor}
          bgColor={bgColor}
        />

        <div className="flex items-center gap-1">
          <div className="flex flex-col items-start mr-1">
            <span className="text-[11px] uppercase text-[#9b87f5]/60">Risk Level</span>
            <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
              {level}
            </span>
          </div>

          <div className="flex items-center">
            <div className="opacity-70 hover:opacity-100 transition-opacity w-[32px]">
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

      {isExpanded && (
        <EntityCardExpanded 
          entity={entity}
          trend={trend}
        />
      )}
    </div>
  );
};

export default EntityCard;

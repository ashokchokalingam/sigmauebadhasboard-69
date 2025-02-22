
import React from "react";
import { Monitor, User, ArrowUpIcon, ArrowDownIcon, Minus, Clock } from "lucide-react";
import RiskLevelIndicator from "./RiskLevelIndicator";
import WaveformDisplay from "./WaveformDisplay";
import RiskScoreDisplay from "./RiskScoreDisplay";
import { RiskyEntity } from "./types";
import { formatDateTime } from "@/utils/dateTimeUtils";

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
    trend: 'up' | 'down' | null;
  } => {
    // Calculate relative width based on risk level
    const getBarWidth = (score: number): number => {
      if (score >= 150) return Math.min((score / 200) * 100, 100); // CRITICAL
      if (score >= 100) return (score / 150) * 75; // HIGH
      if (score >= 50) return (score / 100) * 50; // MEDIUM
      return (score / 50) * 25; // LOW
    };

    const trend = typeof entity.risk_trend === 'number'
      ? entity.risk_trend > 0 
        ? 'up' 
        : entity.risk_trend < 0
          ? 'down'
          : null
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

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, color, textColor, bgColor, lineColor, barWidth, glowColor, trend } = getRiskLevel(riskScore);

  const getTrendIcon = () => {
    if (!trend) {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
    if (trend === 'up') {
      return <ArrowUpIcon className="h-4 w-4 text-[#ea384c]" />; // Red for increased risk
    }
    return <ArrowDownIcon className="h-4 w-4 text-[#34C759]" />; // Green for decreased risk
  };

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
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9b87f5]/60">
              {entity.unique_title_count} unique anomalies
            </span>
            <div className="flex items-center justify-center">
              {getTrendIcon()}
            </div>
          </div>
          {entity.last_seen && (
            <div className="flex items-center gap-1 text-xs text-[#9b87f5]/60">
              <Clock className="h-3 w-3" />
              <span>Last seen: {formatDateTime(entity.last_seen, true)}</span>
            </div>
          )}
        </div>
      </div>

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
  );
};

export default EntityCard;

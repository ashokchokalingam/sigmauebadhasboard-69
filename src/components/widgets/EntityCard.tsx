
import React from "react";
import { Monitor, User, ArrowUpIcon, ArrowDownIcon, Clock } from "lucide-react";
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
    textColor: string; 
    bgColor: string;
    borderColor: string;
    trend: 'up' | 'down' | null;
  } => {
    const trend = typeof entity.risk_trend === 'number'
      ? entity.risk_trend > 0 
        ? 'up' 
        : 'down'
      : null;

    if (score >= 150) return { 
      level: "CRITICAL", 
      textColor: "text-[#FF3B30]",
      bgColor: "bg-transparent",
      borderColor: "border-[#FF3B30]",
      trend
    };
    if (score >= 100) return { 
      level: "HIGH", 
      textColor: "text-[#FF9500]",
      bgColor: "bg-transparent",
      borderColor: "border-[#FF9500]",
      trend
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      textColor: "text-[#FFB340]",
      bgColor: "bg-[#FFB340]/10",
      borderColor: "border-[#FFB340]/20",
      trend
    };
    return { 
      level: "LOW", 
      textColor: "text-[#34C759]",
      bgColor: "bg-[#34C759]/10",
      borderColor: "border-[#34C759]/20",
      trend
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, textColor, bgColor, borderColor, trend } = getRiskLevel(riskScore);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 rounded-lg
        bg-[#0A0B0F] hover:bg-[#12131A]
        border border-[#5856D6]/20 hover:border-[#5856D6]/30
        transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:shadow-[#5856D6]/5"
    >
      <div className="flex items-center gap-3">
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
            {trend && (
              <div className={`flex items-center ${
                trend === 'up' ? 'text-red-400' : 'text-green-400'
              }`}>
                {trend === 'up' ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
              </div>
            )}
          </div>
          {entity.last_seen && (
            <div className="flex items-center gap-1 text-xs text-[#9b87f5]/60">
              <Clock className="h-3 w-3" />
              <span>Last seen: {formatDateTime(entity.last_seen, true)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wider uppercase 
          ${bgColor} ${textColor} border ${borderColor}`}>
          {level}
        </span>
        <RiskScoreDisplay score={riskScore} textColor={textColor} />
      </div>
    </div>
  );
};

export default EntityCard;

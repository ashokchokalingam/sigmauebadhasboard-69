
import React from "react";
import EntityInfo from "./EntityInfo";
import RiskIndicators from "./RiskIndicators";
import { getRiskLevel } from "./utils/riskLevelUtils";
import { formatDateTime } from "@/utils/dateTimeUtils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface EntityCardProps {
  id: string;
  eventCount: number;
  uniqueTitles: number;
  riskScore: string | null;
  timestamp?: string;
  linkedUsers?: string[];
  mitreTactics?: string[];
  risk_trend?: number;
  onClick: () => void;
}

const EntityCard = ({ 
  id, 
  eventCount, 
  uniqueTitles, 
  riskScore, 
  timestamp,
  linkedUsers,
  mitreTactics,
  risk_trend,
  onClick 
}: EntityCardProps) => {
  const score = riskScore ? parseFloat(riskScore) : 0;
  const {
    level,
    textColor,
    bgColor
  } = getRiskLevel(score);

  const trend = typeof risk_trend === 'number'
    ? risk_trend > 0 
      ? 'up' 
      : 'down'
    : null;

  const getCardBorderClass = () => {
    if (score >= 150) return "border-[#FF3B30]/30";
    if (score >= 100) return "border-[#FF9500]/30";
    return "border-[#5856D6]/20";
  };

  const getCardShadowClass = () => {
    if (score >= 150) return "hover:shadow-[0_0_15px_rgba(255,59,48,0.1)]";
    if (score >= 100) return "hover:shadow-[0_0_15px_rgba(255,149,0,0.1)]";
    return "hover:shadow-[0_0_15px_rgba(88,86,214,0.05)]";
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-5 py-3.5 rounded-lg
        bg-[#0A0B0F] hover:bg-[#12131A]
        border ${getCardBorderClass()}
        transition-all duration-300 cursor-pointer
        ${getCardShadowClass()} group
        mb-3`}
    >
      <div className="flex items-center gap-3 flex-1">
        <EntityInfo
          entityName={id}
          isComputer={false}
          uniqueTitleCount={uniqueTitles}
          textColor={textColor}
          bgColor={bgColor}
        />

        {trend && (
          <div className={`flex items-center ${
            trend === 'up' ? 'text-red-400' : 'text-green-400'
          } opacity-0 group-hover:opacity-100 transition-opacity`}>
            {trend === 'up' ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center pl-6 border-l border-[#5856D6]/5 min-w-[200px]">
        <RiskIndicators
          level={level}
          textColor={textColor}
          riskScore={score}
          timestamp={timestamp}
          linkedUsers={linkedUsers}
          mitreTactics={mitreTactics}
        />
      </div>
    </div>
  );
};

export default EntityCard;

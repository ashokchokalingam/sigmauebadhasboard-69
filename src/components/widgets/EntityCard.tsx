
import { Monitor, User } from "lucide-react";
import { memo } from "react";
import { RiskyEntity } from "./types";

interface EntityCardProps {
  entity: RiskyEntity;
  entityType: 'computer' | 'userOrigin' | 'userImpacted';
  onClick: () => void;
}

const EntityCard = memo(({ entity, entityType, onClick }: EntityCardProps) => {
  const isComputer = entityType === 'computer';
  const Icon = isComputer ? Monitor : User;
  const entityName = isComputer ? entity.computer : entity.user;

  const getRiskLevel = (score: number): { level: string; textColor: string } => {
    if (score >= 150) return { 
      level: "CRITICAL", 
      textColor: "text-[#ea384c]"
    };
    if (score >= 100) return { 
      level: "HIGH",
      textColor: "text-[#F97316]"
    };
    if (score >= 50) return { 
      level: "MEDIUM",
      textColor: "text-[#F97316]"
    };
    return { 
      level: "LOW",
      textColor: "text-[#4ADE80]"
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, textColor } = getRiskLevel(riskScore);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-lg 
        bg-[#0A0B0F] hover:bg-[#12131A]
        border border-[#5856D6]/30 hover:border-[#5856D6]/50
        transition-colors duration-300 cursor-pointer
        shadow-sm hover:shadow-md hover:shadow-[#5856D6]/10"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#5856D6]/10 flex items-center justify-center
          border border-[#5856D6]/20">
          <Icon className={`w-4 h-4 ${textColor}`} />
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-mono text-sm text-[#D6BCFA] font-medium hover:text-white truncate max-w-[200px]">
            {entityName}
          </span>
          <span className="text-xs text-[#9b87f5]/70">
            {entity.unique_title_count} unique anomalies
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-xs text-[#9b87f5]/70 uppercase mb-0.5">
          Risk Level
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium uppercase ${textColor}`}>
            {level}
          </span>
          <span className={`font-mono font-bold text-2xl ${textColor}`}>
            {riskScore.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
});

EntityCard.displayName = 'EntityCard';

export default EntityCard;

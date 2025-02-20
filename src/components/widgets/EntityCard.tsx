
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

  const getRiskLevel = (score: number): { level: string; color: string; textColor: string; progressColor: string } => {
    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "bg-[#ea384c]/10",
      textColor: "text-[#ea384c]",
      progressColor: "bg-[#ea384c]"
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "bg-[#F97316]/10",
      textColor: "text-[#F97316]",
      progressColor: "bg-[#F97316]"
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "bg-[#F97316]/10",
      textColor: "text-[#F97316]",
      progressColor: "bg-[#F97316]"
    };
    return { 
      level: "LOW", 
      color: "bg-[#4ADE80]/10",
      textColor: "text-[#4ADE80]",
      progressColor: "bg-[#4ADE80]"
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, textColor, progressColor } = getRiskLevel(riskScore);
  const progressWidth = Math.min((riskScore / 200) * 100, 100);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-lg 
        bg-[#0A0B0F] hover:bg-[#12131A]
        border border-[#5856D6]/30 hover:border-[#5856D6]/50
        transition-colors duration-300 cursor-pointer
        shadow-sm hover:shadow-md hover:shadow-[#5856D6]/10"
    >
      <div className="flex items-center gap-3 flex-[0_0_50%]">
        <div className="w-8 h-8 rounded-full bg-[#5856D6]/10 flex items-center justify-center
          border border-[#5856D6]/20">
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

      <div className="flex-1 flex items-center justify-end gap-4">
        <div className="flex flex-col items-start gap-2">
          <span className={`text-xs ${textColor}`}>Risk Level</span>
          <div className="relative">
            <span className={`text-sm font-medium ${textColor}`}>
              {level}
            </span>
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#5856D6]/10 rounded-full overflow-hidden">
              <div 
                className={`h-full ${progressColor}`}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <div className="relative w-6 h-4 overflow-hidden opacity-60">
            <svg 
              className={`w-[200%] h-full animate-cardiogram ${textColor}`}
              viewBox="0 0 120 24" 
              preserveAspectRatio="none"
            >
              <path
                d="M0,12 L20,12 L24,4 L28,20 L32,12 L60,12 L64,4 L68,20 L72,12 L100,12 L104,4 L108,20 L112,12 L120,12"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="currentColor"
              />
            </svg>
          </div>
          
          <div className={`font-mono font-bold text-2xl ${textColor} select-none`}>
            {riskScore.toFixed(1)}
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#5856D6]/10 rounded-full overflow-hidden">
            <div 
              className={`h-full ${progressColor}`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

EntityCard.displayName = 'EntityCard';

export default EntityCard;

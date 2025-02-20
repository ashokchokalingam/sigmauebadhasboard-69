
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

  const getRiskLevel = (score: number): { 
    level: string; 
    color: string;
    textColor: string; 
    bgColor: string;
    lineColor: string;
  } => {
    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "#ea384c",
      textColor: "text-[#ea384c]",
      bgColor: "bg-[#ea384c]/5",
      lineColor: "bg-[#ea384c]"
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "#F97316",
      textColor: "text-[#F97316]",
      bgColor: "bg-[#F97316]/5",
      lineColor: "bg-[#F97316]"
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "#F97316",
      textColor: "text-[#F97316]",
      bgColor: "bg-[#F97316]/5",
      lineColor: "bg-[#F97316]"
    };
    return { 
      level: "LOW", 
      color: "#4ADE80",
      textColor: "text-[#4ADE80]",
      bgColor: "bg-[#4ADE80]/5",
      lineColor: "bg-[#4ADE80]"
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, textColor, bgColor, lineColor } = getRiskLevel(riskScore);

  // SVG path for cardiogram
  const cardiogramPath = "M0,10 L5,10 L7,2 L9,18 L11,10 L13,10 L15,6 L17,14 L19,10 L21,10";

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

      <div className="flex items-center justify-end gap-8">
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase text-[#9b87f5]/70 mb-2">Risk Level</span>
          <span className={`text-sm font-medium tracking-wider uppercase ${textColor} w-[80px] text-right`}>
            {level}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="cardiogram relative w-16 h-5 overflow-hidden opacity-70">
            <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 22 20" fill="none" 
              xmlns="http://www.w3.org/2000/svg">
              <path
                d={cardiogramPath}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${textColor} stroke-current`}
              />
            </svg>
          </div>

          <div className="relative min-w-[80px] text-right">
            <div className={`font-mono font-bold text-2xl tabular-nums ${textColor}`}>
              {riskScore.toFixed(1)}
            </div>
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#5856D6]/10 rounded-full overflow-hidden">
              <div 
                className={`h-full ${lineColor} transition-all duration-300`}
                style={{ width: `${Math.min((riskScore / 200) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EntityCard.displayName = 'EntityCard';

export default EntityCard;

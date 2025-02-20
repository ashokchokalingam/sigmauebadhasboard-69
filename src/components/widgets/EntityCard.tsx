
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
    nextThreshold?: number;
  } => {
    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "#FF1A1A",
      textColor: "text-[#FF1A1A]",
      bgColor: "bg-[#FF1A1A]/5",
      lineColor: "bg-[#FF1A1A]",
      nextThreshold: 200  // Maximum score
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "#FF3D00",
      textColor: "text-[#FF3D00]",
      bgColor: "bg-[#FF3D00]/5",
      lineColor: "bg-[#FF3D00]",
      nextThreshold: 150
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "#FFB100",
      textColor: "text-[#FFB100]",
      bgColor: "bg-[#FFB100]/5",
      lineColor: "bg-[#FFB100]",
      nextThreshold: 100
    };
    return { 
      level: "LOW", 
      color: "#4ADE80",
      textColor: "text-[#4ADE80]",
      bgColor: "bg-[#4ADE80]/5",
      lineColor: "bg-[#4ADE80]",
      nextThreshold: 50
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, textColor, bgColor, lineColor, nextThreshold } = getRiskLevel(riskScore);
  
  // Calculate progress within current risk level
  const getProgressInLevel = () => {
    if (level === "LOW") return (riskScore / 50) * 100;
    if (level === "MEDIUM") return ((riskScore - 50) / 50) * 100;
    if (level === "HIGH") return ((riskScore - 100) / 50) * 100;
    return ((riskScore - 150) / 50) * 100;
  };

  const progress = Math.min(getProgressInLevel(), 100);

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

      <div className="flex items-center justify-end gap-10">
        <div className="flex flex-col items-start w-[130px]">
          <span className="text-xs uppercase text-[#9b87f5]/70 mb-2">Risk Level</span>
          <div className="w-full">
            <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
              {level}
            </span>
          </div>
        </div>

        <div className="relative min-w-[140px]">
          <div className="flex items-end justify-end mb-1">
            <div className={`font-mono font-bold text-2xl tabular-nums ${textColor}`}>
              {riskScore.toFixed(1)}
            </div>
          </div>
          
          <div className="relative h-2 bg-[#5856D6]/10 rounded-full overflow-hidden">
            {/* Background segments for risk levels */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 border-r border-[#5856D6]/20" />
              <div className="flex-1 border-r border-[#5856D6]/20" />
              <div className="flex-1 border-r border-[#5856D6]/20" />
              <div className="flex-1" />
            </div>
            
            {/* Current progress */}
            <div 
              className={`h-full ${lineColor} transition-all duration-300`}
              style={{ 
                width: `${progress}%`,
                boxShadow: `0 0 10px ${getRiskLevel(riskScore).color}`
              }}
            />
          </div>
          
          {/* Progress markers */}
          <div className="absolute -bottom-3 left-0 right-0 flex justify-between">
            <div className="text-[10px] text-[#9b87f5]/50">0</div>
            <div className="text-[10px] text-[#9b87f5]/50">50</div>
            <div className="text-[10px] text-[#9b87f5]/50">100</div>
            <div className="text-[10px] text-[#9b87f5]/50">150</div>
            <div className="text-[10px] text-[#9b87f5]/50">200</div>
          </div>
        </div>
      </div>
    </div>
  );
});

EntityCard.displayName = 'EntityCard';

export default EntityCard;

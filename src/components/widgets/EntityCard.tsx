
import { Monitor, User, ArrowUp, ArrowDown } from "lucide-react";
import { memo } from "react";
import { RiskyEntity } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CardiogramSVG from "../dashboard/CardiogramSVG";

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
  
  const riskIncreasing = riskScore > 100;
  const riskChangePercent = ((riskScore - 50) / 50 * 100).toFixed(1);

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
        <div className="flex flex-col items-start w-[90px]">
          <span className="text-xs uppercase text-[#9b87f5]/70 mb-0.5">Risk Level</span>
          <div className="w-full">
            <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
              {level}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="opacity-70 hover:opacity-100 transition-opacity w-[45px]">
            <CardiogramSVG riskLevel={level as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} color={color} />
          </div>
        </div>

        <div className="relative min-w-[140px] ml-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-end gap-2 mb-1">
                  {riskIncreasing ? (
                    <ArrowUp className={`w-4 h-4 ${textColor}`} />
                  ) : (
                    <ArrowDown className={`w-4 h-4 ${textColor}`} />
                  )}
                  <div className={`font-mono font-bold text-2xl tabular-nums ${textColor}`}>
                    {riskScore.toFixed(1)}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="bg-[#0A0B0F]/90 border border-[#5856D6]/20 backdrop-blur-xl"
              >
                <p className="text-xs text-[#D6BCFA]">
                  {riskIncreasing 
                    ? `Risk increased by ${riskChangePercent}% over the last 24 hours`
                    : `Risk decreased by ${Math.abs(Number(riskChangePercent))}% due to reduced anomalies`
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="relative h-2 bg-[#5856D6]/10 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="flex-1 border-r border-[#5856D6]/20" />
              <div className="flex-1 border-r border-[#5856D6]/20" />
              <div className="flex-1 border-r border-[#5856D6]/20" />
              <div className="flex-1" />
            </div>
            
            <div 
              className={`h-full ${lineColor} transition-all duration-300`}
              style={{ 
                width: `${barWidth}%`,
                boxShadow: `0 0 10px ${glowColor}, 0 0 15px ${color}40`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

EntityCard.displayName = 'EntityCard';

export default EntityCard;

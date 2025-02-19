
import React from "react";
import { cn } from "@/lib/utils";
import EntityCardIcon from "./EntityCardIcon";
import EntityCardRiskLevel from "./EntityCardRiskLevel";
import EntityCardRiskGauge from "./EntityCardRiskGauge";

interface EntityCardProps {
  id: string | null;
  eventCount?: number | null;
  uniqueTitles?: number | null;
  onClick: () => void;
  riskScore?: string | null;
}

const EntityCard = ({ id, uniqueTitles = 0, onClick, riskScore }: EntityCardProps) => {
  const isComputer = id?.endsWith('$') ?? false;
  const safeUniqueTitles = typeof uniqueTitles === 'number' ? uniqueTitles : 0;

  const isHighRisk = (score: string | null) => {
    if (!score) return false;
    return parseInt(score) >= 200;
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex items-center p-4 rounded-xl h-[80px]",
        "transition-all duration-300 cursor-pointer",
        "bg-[#0A0B0F] hover:bg-[#12131A]",
        "border border-[#9b87f5]/20 hover:border-[#9b87f5]/40",
        "hover:shadow-lg hover:shadow-[#9b87f5]/5",
      )}
    >
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <EntityCardIcon isComputer={isComputer} />
          
          <div className="flex flex-col overflow-hidden">
            <span className="font-mono text-sm text-[#D6BCFA] font-medium group-hover:text-white tracking-wide truncate">
              {id || 'Unknown'}
            </span>
            <span className="text-xs text-[#9b87f5]/70 font-medium mt-1 tracking-wider whitespace-nowrap">
              {safeUniqueTitles} unique anomalies
            </span>
          </div>
        </div>

        {riskScore && (
          <div className="flex items-center gap-4 shrink-0">
            <EntityCardRiskLevel 
              riskScore={riskScore} 
              isHighRisk={isHighRisk(riskScore)} 
            />
            
            <EntityCardRiskGauge riskScore={riskScore} />

            <span className={cn(
              "font-mono font-bold text-2xl min-w-[60px] text-right",
              "text-[#D6BCFA]",
              "tracking-tight",
              isHighRisk(riskScore) && "text-[#ea384c] animate-pulse"
            )}>
              {riskScore}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityCard;


import React from "react";
import { cn } from "@/lib/utils";
import EntityCardIcon from "./EntityCardIcon";
import EntityCardRiskLevel from "./EntityCardRiskLevel";
import EntityCardCardiogram from "./EntityCardCardiogram";

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
        "group relative flex items-center p-6 rounded-xl h-[90px]",
        "transition-all duration-300 cursor-pointer",
        "bg-gradient-to-r from-[#0A0B0F] via-[#12131A] to-[#1A1F2C]",
        "border border-[#9b87f5]/20 hover:border-[#9b87f5]/40",
        "hover:shadow-lg hover:shadow-[#9b87f5]/5",
        "hover:scale-[1.01] transform"
      )}
    >
      <div className="flex items-center w-full">
        <div className="flex items-center gap-4 flex-[0_0_50%]">
          <EntityCardIcon isComputer={isComputer} />
          
          <div className="flex flex-col min-w-[120px]">
            <span className="font-mono text-sm text-[#D6BCFA] font-medium group-hover:text-white tracking-wide truncate max-w-[250px]">
              {id || 'Unknown'}
            </span>
            <span className="text-xs text-[#9b87f5]/70 font-medium mt-1 tracking-wider">
              {safeUniqueTitles} unique anomalies
            </span>
          </div>
        </div>

        {riskScore && (
          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center gap-6">
              <EntityCardRiskLevel 
                riskScore={riskScore} 
                isHighRisk={isHighRisk(riskScore)} 
              />
              
              <EntityCardCardiogram isHighRisk={isHighRisk(riskScore)} />

              <span className={cn(
                "font-mono font-bold text-2xl min-w-[80px] text-right",
                "bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] bg-clip-text text-transparent",
                "tracking-tight",
                isHighRisk(riskScore) && "animate-pulse"
              )}>
                {riskScore}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityCard;

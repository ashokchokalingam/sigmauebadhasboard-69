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
        "group relative flex items-center p-6 rounded-lg h-[84px]",
        "transition-all duration-300 cursor-pointer",
        "bg-gradient-to-r from-[#0A0B0F] to-[#12131A]",
        "border border-[#5856D6]/20 hover:border-[#5856D6]/40",
        "hover:shadow-lg hover:shadow-[#5856D6]/5"
      )}
    >
      <div className="flex items-center w-full">
        <div className="flex items-center gap-4 flex-[0_0_50%]">
          <EntityCardIcon isComputer={isComputer} />
          
          <div className="flex flex-col min-w-[120px]">
            <span className="font-mono text-xl text-white/90 font-medium group-hover:text-white truncate max-w-[200px]">
              {id || 'Unknown'}
            </span>
            <span className="text-lg text-[#9b87f5] font-semibold mt-1 drop-shadow-[0_0_3px_rgba(155,135,245,0.3)]">
              {safeUniqueTitles} unique anomalies
            </span>
          </div>
        </div>

        {riskScore && (
          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center gap-4">
              <EntityCardRiskLevel 
                riskScore={riskScore} 
                isHighRisk={isHighRisk(riskScore)} 
              />
              
              <EntityCardCardiogram isHighRisk={isHighRisk(riskScore)} />

              <span className={cn(
                "font-mono font-bold text-5xl min-w-[80px] text-right",
                "text-[#9b87f5]",
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
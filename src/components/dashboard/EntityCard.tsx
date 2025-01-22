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

  const getRiskLevel = (score: string | null) => {
    if (!score) return 'low';
    const numScore = parseInt(score);
    if (numScore >= 200) return 'critical';
    if (numScore >= 100) return 'high';
    if (numScore >= 50) return 'medium';
    return 'low';
  };

  const riskLevel = getRiskLevel(riskScore);

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex items-center p-6 rounded-lg h-[90px]",
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
            <span className="font-mono text-sm text-white/90 font-medium group-hover:text-white truncate max-w-[250px]">
              {id || 'Unknown'}
            </span>
            <span className="text-xs text-[#9b87f5] font-medium mt-1">
              {safeUniqueTitles} unique anomalies
            </span>
          </div>
        </div>

        {riskScore && (
          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center gap-4">
              <EntityCardRiskLevel 
                riskScore={riskScore} 
                isHighRisk={riskLevel === 'critical'} 
              />
              
              <EntityCardCardiogram riskLevel={riskLevel} />

              <span className={cn(
                "font-mono font-bold text-2xl min-w-[80px] text-right",
                "text-[#9b87f5]",
                riskLevel === 'critical' && "animate-pulse"
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
import React from "react";
import { Computer, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
  
  const getRiskColor = (score: string | null) => {
    if (!score) return "text-blue-400/70";
    const numScore = parseInt(score);
    if (numScore >= 200) return "text-red-400";
    if (numScore >= 100) return "text-orange-400";
    if (numScore >= 50) return "text-yellow-400";
    return "text-green-400";
  };

  const getRiskBgColor = (score: string | null) => {
    if (!score) return "bg-blue-500/5";
    const numScore = parseInt(score);
    if (numScore >= 200) return "bg-red-500/10";
    if (numScore >= 100) return "bg-orange-500/10";
    if (numScore >= 50) return "bg-yellow-500/10";
    return "bg-green-500/10";
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-lg",
        "transition-all duration-300 cursor-pointer",
        "bg-[#1e2c3d]/40 hover:bg-[#1e2c3d]/60",
        "border border-blue-500/5 hover:border-blue-500/10"
      )}
    >
      <div className="flex items-center gap-4 w-full">
        <div className="relative w-10 h-10 rounded-full bg-blue-950/30 flex items-center justify-center">
          {isComputer ? (
            <Computer className="w-5 h-5 text-blue-400/70" />
          ) : (
            <User className="w-5 h-5 text-blue-400/70" />
          )}
        </div>
        
        <div className="flex flex-col min-w-[120px]">
          <span className="font-mono text-base text-blue-200/90 font-medium group-hover:text-blue-100 truncate max-w-[200px]">
            {id || 'Unknown'}
          </span>
          <span className="text-sm text-blue-300/60 mt-1">
            {safeUniqueTitles} unique anomalies
          </span>
        </div>

        {riskScore && (
          <div className="flex-1 flex items-center justify-center">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2",
              "relative overflow-hidden"
            )}>
              <div className="absolute inset-0 w-[200%] h-full">
                <svg className="w-full h-full animate-cardiogram" viewBox="0 0 1200 200" preserveAspectRatio="none">
                  <path
                    d="M0,100 L300,100 L320,20 L340,180 L360,100 L600,100 L620,20 L640,180 L660,100 L900,100 L920,20 L940,180 L960,100 L1200,100"
                    className={cn("stroke-current fill-none stroke-[3]", getRiskColor(riskScore))}
                  />
                </svg>
              </div>
              <span className="text-blue-300/90 font-medium text-base mr-2">Risk</span>
              <span className={cn(
                "font-bold text-lg",
                getRiskColor(riskScore)
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
import React from "react";
import { Computer, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRiskColor } from "./utils/colorUtils";

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
    if (!score) return "";
    const numScore = parseInt(score);
    if (numScore >= 200) return "critical";
    if (numScore >= 50) return "high";
    return "low";
  };

  const isHighRisk = (score: string | null) => {
    if (!score) return false;
    return parseInt(score) >= 200;
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex items-center p-4 rounded-lg h-[72px]",
        "transition-all duration-300 cursor-pointer",
        "bg-[#1e2c3d]/40 hover:bg-[#1e2c3d]/60",
        "border border-blue-500/5 hover:border-blue-500/10"
      )}
    >
      <div className="flex items-center w-full">
        <div className="flex items-center gap-4 flex-[0_0_50%]">
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
            <span className="text-sm text-[#5856D6] font-medium mt-1 drop-shadow-[0_0_3px_rgba(88,86,214,0.3)]">
              {safeUniqueTitles} unique anomalies
            </span>
          </div>
        </div>

        {riskScore && (
          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className={cn(
                  "text-blue-300/90 font-medium text-base",
                  getRiskColor(getRiskLevel(riskScore)),
                  isHighRisk(riskScore) && "animate-pulse"
                )}>
                  Risk
                </span>
                <span className={cn(
                  "text-xs font-medium -mt-0.5",
                  getRiskColor(getRiskLevel(riskScore)),
                  isHighRisk(riskScore) && "animate-pulse"
                )}>
                  {getRiskLevel(riskScore)}
                </span>
              </div>
              <div className="relative w-20 h-6 overflow-hidden">
                <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
                  <path
                    d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                    className={cn(
                      "stroke-current fill-none stroke-[4]",
                      getRiskColor(getRiskLevel(riskScore)),
                      isHighRisk(riskScore) && "animate-pulse"
                    )}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className={cn(
                "font-bold text-3xl min-w-[70px] text-right",
                getRiskColor(getRiskLevel(riskScore)),
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
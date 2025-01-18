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
        "group relative flex items-center p-5 rounded-lg h-[82px]",
        "transition-all duration-300 cursor-pointer",
        "bg-[#1e2c3d]/40 hover:bg-[#1e2c3d]/60",
        "border border-red-500/5 hover:border-red-500/10"
      )}
    >
      <div className="flex items-center w-full">
        <div className="flex items-center gap-5 flex-[0_0_50%]">
          <div className="relative w-12 h-12 rounded-full bg-red-950/30 flex items-center justify-center">
            {isComputer ? (
              <Computer className="w-6 h-6 text-red-400/70" />
            ) : (
              <User className="w-6 h-6 text-red-400/70" />
            )}
          </div>
          
          <div className="flex flex-col min-w-[140px]">
            <span className="font-mono text-lg text-red-200/90 font-medium group-hover:text-red-100 truncate max-w-[240px]">
              {id || 'Unknown'}
            </span>
            <span className="text-base text-red-500 font-semibold mt-1 drop-shadow-[0_0_3px_rgba(239,68,68,0.3)]">
              {safeUniqueTitles} unique anomalies
            </span>
          </div>
        </div>

        {riskScore && (
          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className={cn(
                  "text-red-300/90 font-medium text-lg",
                  getRiskColor(getRiskLevel(riskScore)),
                  isHighRisk(riskScore) && "animate-pulse"
                )}>
                  Risk Level
                </span>
                <span className={cn(
                  "text-sm font-medium -mt-0.5",
                  getRiskColor(getRiskLevel(riskScore)),
                  isHighRisk(riskScore) && "animate-pulse"
                )}>
                  {getRiskLevel(riskScore)}
                </span>
              </div>
              
              {/* Cardiogram Animation */}
              <div className="relative w-24 h-8 overflow-hidden">
                <svg 
                  className={cn(
                    "w-[200%] h-full animate-cardiogram",
                    getRiskColor(getRiskLevel(riskScore))
                  )} 
                  viewBox="0 0 600 100" 
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                    className="stroke-current fill-none stroke-[4]"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className={cn(
                "font-mono font-bold text-4xl min-w-[80px] text-right",
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
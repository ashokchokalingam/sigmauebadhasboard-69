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
        "group relative flex items-center p-6 rounded-lg h-[84px]",
        "transition-all duration-300 cursor-pointer",
        "bg-gradient-to-r from-[#0A0B0F] to-[#12131A]",
        "border border-[#5856D6]/20 hover:border-[#5856D6]/40",
        "hover:shadow-lg hover:shadow-[#5856D6]/5"
      )}
    >
      <div className="flex items-center w-full">
        <div className="flex items-center gap-4 flex-[0_0_50%]">
          <div className="relative w-12 h-12 rounded-full bg-[#5856D6]/10 flex items-center justify-center border border-[#5856D6]/20">
            {isComputer ? (
              <Computer className="w-6 h-6 text-[#9b87f5]" />
            ) : (
              <User className="w-6 h-6 text-[#9b87f5]" />
            )}
          </div>
          
          <div className="flex flex-col min-w-[120px]">
            <span className="font-mono text-lg text-white/90 font-medium group-hover:text-white truncate max-w-[200px]">
              {id || 'Unknown'}
            </span>
            <span className="text-base text-[#9b87f5] font-semibold mt-1 drop-shadow-[0_0_3px_rgba(155,135,245,0.3)]">
              {safeUniqueTitles} unique anomalies
            </span>
          </div>
        </div>

        {riskScore && (
          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className={cn(
                  "text-[#9b87f5] font-medium text-lg",
                  isHighRisk(riskScore) && "animate-pulse"
                )}>
                  Risk Level
                </span>
                <span className={cn(
                  "text-sm font-medium -mt-0.5 text-[#D6BCFA]",
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
                    "stroke-[#9b87f5]"
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
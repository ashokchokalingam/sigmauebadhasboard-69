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
        "group relative flex items-center p-3 rounded-lg",
        "transition-all duration-300 cursor-pointer",
        "bg-[#0D0E12] hover:bg-[#15161E]",
        "border border-blue-500/10 hover:border-blue-500/20"
      )}
    >
      <div className="flex items-center w-full gap-3">
        <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
          {isComputer ? (
            <Computer className="w-5 h-5 text-blue-400/70" />
          ) : (
            <User className="w-5 h-5 text-blue-400/70" />
          )}
        </div>
        
        <div className="flex flex-col min-w-[120px]">
          <span className="font-mono text-base text-blue-100/90 font-medium group-hover:text-blue-100 truncate max-w-[200px]">
            {id || 'Unknown'}
          </span>
          <span className="text-sm text-blue-400/70 mt-1">
            {safeUniqueTitles} unique anomalies
          </span>
        </div>

        {riskScore && (
          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center w-10">
                <span className={cn(
                  "text-sm font-medium",
                  getRiskColor(getRiskLevel(riskScore))
                )}>
                  Risk
                </span>
                <span className={cn(
                  "text-xs font-medium",
                  getRiskColor(getRiskLevel(riskScore))
                )}>
                  {getRiskLevel(riskScore)}
                </span>
              </div>
              <div className="relative w-16 h-6 overflow-hidden">
                <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
                  <path
                    d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                    className={cn(
                      "stroke-current fill-none stroke-[3]",
                      getRiskColor(getRiskLevel(riskScore))
                    )}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className={cn(
                "font-mono font-bold text-2xl tabular-nums",
                getRiskColor(getRiskLevel(riskScore))
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
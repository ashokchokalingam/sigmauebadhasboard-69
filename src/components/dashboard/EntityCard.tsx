import React from "react";
import { Computer, User, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityCardProps {
  id: string | null;
  eventCount?: number | null;
  uniqueTitles?: number | null;
  onClick: () => void;
  riskScore?: string | null;
  tacticsCount?: string | null;
  uniqueOutliers?: number | null;
}

const EntityCard = ({ 
  id, 
  uniqueTitles = 0, 
  onClick, 
  riskScore,
  tacticsCount,
  uniqueOutliers
}: EntityCardProps) => {
  const isComputer = id?.endsWith('$') ?? false;

  const getRiskLevel = (score: string | null) => {
    if (!score) return "";
    const numScore = parseInt(score);
    if (numScore >= 200) return "critical";
    if (numScore >= 50) return "high";
    return "low";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative rounded-lg cursor-pointer",
        "bg-purple-950/30 hover:bg-purple-900/20 transition-all duration-300"
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
              {isComputer ? (
                <Computer className="w-4 h-4 text-purple-400" />
              ) : (
                <User className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-100">
                {id || 'Unknown'}
              </h3>
              <p className="text-xs text-purple-400/60">
                {uniqueTitles} unique anomalies
              </p>
            </div>
          </div>
          {riskScore && (
            <div className={cn(
              "text-2xl font-bold",
              getRiskColor(getRiskLevel(riskScore))
            )}>
              {riskScore}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-950/30 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-purple-300">Total Anomalies</span>
            </div>
            <div className="text-lg font-semibold text-purple-100">
              {uniqueTitles}
            </div>
            <div className="text-xs text-purple-400/60 mt-1">
              Tactics: {tacticsCount}
            </div>
          </div>

          <div className="bg-purple-950/30 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-purple-300">Unique Outliers</span>
            </div>
            <div className="text-lg font-semibold text-purple-100">
              {uniqueOutliers}
            </div>
            <div className="text-xs text-purple-400/60 mt-1">
              Behavioral anomalies
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-1 w-full bg-purple-950/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
              style={{ 
                width: `${Math.min((parseInt(riskScore || '0') / 300) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {riskScore && (
          <div className="relative w-full h-6 overflow-hidden mt-2">
            <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
              <path
                d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                className={cn(
                  "stroke-current fill-none stroke-[4]",
                  getRiskColor(getRiskLevel(riskScore))
                )}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityCard;
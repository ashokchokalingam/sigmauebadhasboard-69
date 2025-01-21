import { Monitor, User, Info, TrendingUp, TrendingDown } from "lucide-react";
import { RiskyEntity } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EntityCardProps {
  entity: RiskyEntity;
  entityType: 'computer' | 'userOrigin' | 'userImpacted';
  onClick: () => void;
}

const EntityCard = ({ entity, entityType, onClick }: EntityCardProps) => {
  const isComputer = entityType === 'computer';
  const Icon = isComputer ? Monitor : User;
  const entityName = isComputer ? entity.computer : entity.user;

  const getRiskLevel = (score: number): { 
    level: string; 
    color: string; 
    bgColor: string; 
    glowColor: string;
    trend: "up" | "down" | "stable";
  } => {
    // Simulate trend based on score ranges - in real app this would come from actual trend data
    const trend = score > 150 ? "up" : score < 50 ? "down" : "stable";
    
    if (score >= 200) return { 
      level: "CRITICAL", 
      color: "text-risk-critical",
      bgColor: "bg-risk-critical/10",
      glowColor: "shadow-risk-critical-glow",
      trend
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "text-risk-high",
      bgColor: "bg-risk-high/10",
      glowColor: "shadow-risk-high-glow",
      trend
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "text-risk-medium",
      bgColor: "bg-risk-medium/10",
      glowColor: "shadow-risk-medium-glow",
      trend
    };
    return { 
      level: "LOW", 
      color: "text-risk-low",
      bgColor: "bg-risk-low/10",
      glowColor: "shadow-risk-low-glow",
      trend
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, color, bgColor, glowColor, trend } = getRiskLevel(riskScore);

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <TooltipProvider>
      <div
        onClick={onClick}
        className={`group relative p-6 rounded-lg
          bg-gradient-to-r from-dashboard-section-1 to-dashboard-section-2
          hover:from-dashboard-section-2 hover:to-dashboard-section-3
          border border-gray-500/20 hover:border-gray-500/40
          transition-all duration-300 cursor-pointer
          backdrop-blur-sm ${glowColor}
          hover:shadow-lg hover:-translate-y-0.5
          space-y-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300 ${color}`}></div>
              <Icon className={`relative h-6 w-6 ${color}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium text-gray-200 group-hover:text-white">
                  {entityName}
                </h3>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View detailed analytics for this entity</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className={`text-sm ${color} opacity-70 group-hover:opacity-90`}>
                {entity.unique_title_count} unique anomalies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className={`block text-sm font-medium ${color}`}>
                Risk Level
              </span>
              <div className="flex items-center gap-2">
                <span className={`block text-xs ${color} uppercase tracking-wide font-bold`}>
                  {level}
                </span>
                {TrendIcon && (
                  <TrendIcon className={`h-4 w-4 ${color}`} />
                )}
              </div>
            </div>
            
            <div className="relative w-24 h-8 overflow-hidden">
              <svg 
                className={`w-[200%] h-full animate-cardiogram ${color}`}
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
            
            <div className={`relative px-4 py-2 rounded-lg ${bgColor} backdrop-blur-sm`}>
              <span className={`font-mono text-2xl font-bold ${color} ${
                riskScore >= 200 ? 'animate-pulse-glow' : ''
              }`}>
                {riskScore.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-700/20 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-300`}
            style={{ width: `${Math.min((riskScore / 300) * 100, 100)}%` }}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EntityCard;
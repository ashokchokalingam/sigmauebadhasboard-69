
import { Monitor, User } from "lucide-react";
import { RiskyEntity } from "./types";

interface EntityCardProps {
  entity: RiskyEntity;
  entityType: 'computer' | 'userOrigin' | 'userImpacted';
  onClick: () => void;
}

const EntityCard = ({ entity, entityType, onClick }: EntityCardProps) => {
  const isComputer = entityType === 'computer';
  const Icon = isComputer ? Monitor : User;
  const entityName = isComputer ? entity.computer : entity.user;

  const getRiskLevel = (score: number): { level: string; color: string; bgColor: string; glowColor: string } => {
    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "text-[#ea384c]",
      bgColor: "bg-[#ea384c]/10",
      glowColor: "shadow-[0_0_15px_rgba(234,56,76,0.2)]"
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "text-[#ea384c]",
      bgColor: "bg-[#ea384c]/10",
      glowColor: "shadow-[0_0_15px_rgba(234,56,76,0.2)]"
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "text-[#ea384c]",
      bgColor: "bg-[#ea384c]/10",
      glowColor: "shadow-[0_0_15px_rgba(234,56,76,0.2)]"
    };
    return { 
      level: "LOW", 
      color: "text-[#98FB98]",
      bgColor: "bg-[#98FB98]/10",
      glowColor: "shadow-[0_0_15px_rgba(152,251,152,0.2)]"
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, color, bgColor, glowColor } = getRiskLevel(riskScore);

  return (
    <div
      onClick={onClick}
      className={`group relative p-4 rounded-lg
        bg-[#0A0B0F]/90 hover:bg-[#12131A]
        border border-[#5856D6]/20 hover:border-[#5856D6]/40
        transition-all duration-300 cursor-pointer
        backdrop-blur-sm ${glowColor}
        hover:shadow-lg hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300 ${color}`}></div>
            <Icon className={`relative h-5 w-5 ${color}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 group-hover:text-white">
              {entityName}
            </h3>
            <p className={`text-xs ${color} opacity-70 group-hover:opacity-90`}>
              {entity.unique_title_count} unique anomalies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className={`block text-sm font-medium ${color}`}>
              Risk Level
            </span>
            <span className={`block text-xs ${color} uppercase tracking-wide`}>
              {level}
            </span>
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
            <span className={`font-mono font-bold text-2xl ${color} ${
              riskScore >= 150 ? 'animate-pulse' : ''
            }`}>
              {riskScore.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;


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

  const getRiskLevel = (score: number): { level: string; color: string; textColor: string } => {
    if (score >= 150) return { 
      level: "CRITICAL", 
      color: "bg-gradient-to-r from-[#ea384c]/10 to-transparent",
      textColor: "text-[#ea384c]"
    };
    if (score >= 100) return { 
      level: "HIGH", 
      color: "bg-gradient-to-r from-[#F97316]/10 to-transparent",
      textColor: "text-[#F97316]"
    };
    if (score >= 50) return { 
      level: "MEDIUM", 
      color: "bg-gradient-to-r from-[#FEC6A1]/10 to-transparent",
      textColor: "text-[#FEC6A1]"
    };
    return { 
      level: "LOW", 
      color: "bg-gradient-to-r from-[#4ADE80]/10 to-transparent",
      textColor: "text-[#4ADE80]"
    };
  };

  const riskScore = parseFloat(entity.cumulative_risk_score);
  const { level, color, textColor } = getRiskLevel(riskScore);

  return (
    <div
      onClick={onClick}
      className="group relative p-4 rounded-lg cursor-pointer
        transition-all duration-300 ease-in-out
        bg-black/40 hover:bg-black/50
        border border-[#5856D6]/20 hover:border-[#5856D6]/30"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 ${color} opacity-20 rounded-lg transition-opacity duration-300 group-hover:opacity-30`} />

      <div className="relative flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#5856D6]/10 border border-[#5856D6]/20 
              flex items-center justify-center">
              <Icon className={`w-4 h-4 ${textColor}`} />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-200 font-medium">
              {entityName}
            </span>
            <span className={`text-xs ${textColor}`}>
              {entity.unique_title_count} unique anomalies
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className={`text-xs ${textColor}`}>Risk Level</span>
            <span className={`text-xs font-medium ${textColor}`}>{level}</span>
          </div>

          {/* Risk Score */}
          <div className="relative">
            <div className={`
              font-mono font-bold text-2xl px-3 py-1 rounded
              bg-black/40 border border-[#5856D6]/20
              ${textColor} ${riskScore >= 150 ? 'animate-[pulse_5s_cubic-bezier(0.4,0,0.6,1)_infinite]' : ''}
            `}>
              {riskScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;

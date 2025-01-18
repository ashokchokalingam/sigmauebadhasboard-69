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

  return (
    <div
      onClick={onClick}
      className="group p-4 rounded-lg
        bg-gradient-to-r from-[#0D0E12] to-[#12131A]
        hover:from-[#12131A] hover:to-[#1A1F2C]
        border border-purple-500/20 hover:border-purple-500/40
        transition-all duration-300 cursor-pointer
        shadow-lg hover:shadow-xl hover:shadow-purple-500/5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <Icon className="relative h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-purple-100/90 group-hover:text-purple-100">
              {entityName}
            </h3>
            <p className="text-xs text-purple-400/70 group-hover:text-purple-400/90">
              {entity.unique_title_count} unique anomalies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-sm font-medium text-purple-400 group-hover:text-purple-300">
              Risk Level
            </span>
            <span className="block text-xs text-purple-400/70 group-hover:text-purple-400">
              Critical
            </span>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <span className="relative font-mono font-bold text-2xl text-purple-400 group-hover:text-purple-300">
              {entity.cumulative_risk_score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;

import React from "react";
import { Monitor, User } from "lucide-react";
import { RiskyEntity } from "./types";

interface EntityCardInfoProps {
  entityType: 'computer' | 'userOrigin' | 'userImpacted';
  entity: RiskyEntity;
  textColor: string;
  bgColor: string;
}

const EntityCardInfo = ({ entityType, entity, textColor, bgColor }: EntityCardInfoProps) => {
  const isComputer = entityType === 'computer';
  const Icon = isComputer ? Monitor : User;
  const entityName = isComputer ? entity.computer : entity.user;

  return (
    <div className="flex items-center gap-3 flex-[0_0_40%]">
      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center
        border border-[#5856D6]/10`}>
        <Icon className={`w-4 h-4 ${textColor}`} />
      </div>
      
      <div className="flex flex-col min-w-[120px] gap-0.5">
        <span className="font-mono text-sm text-[#D6BCFA] font-medium hover:text-white truncate max-w-[180px]">
          {entityName}
        </span>
        <span className="text-xs text-[#9b87f5]/60">
          {entity.unique_title_count} unique anomalies
        </span>
      </div>
    </div>
  );
};

export default EntityCardInfo;

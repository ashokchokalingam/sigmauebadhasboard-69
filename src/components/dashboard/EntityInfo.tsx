
import { Monitor, User } from "lucide-react";

interface EntityInfoProps {
  entityName: string;
  isComputer: boolean;
  uniqueTitleCount: number;
  textColor: string;
  bgColor: string;
}

const EntityInfo = ({ entityName, isComputer, uniqueTitleCount, textColor, bgColor }: EntityInfoProps) => {
  const Icon = isComputer ? Monitor : User;

  return (
    <div className="flex items-center gap-3 flex-[0_0_40%]">
      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center
        border border-[#5856D6]/10`}>
        <Icon className={`w-4 h-4 ${textColor}`} />
      </div>
      
      <div className="flex flex-col min-w-[120px] gap-0.5">
        <span className="font-mono text-[16px] text-[#D6BCFA] font-medium hover:text-white truncate max-w-[180px]">
          {entityName}
        </span>
        <span className="text-[13px] text-[#9b87f5]/60">
          {uniqueTitleCount} unique anomalies
        </span>
      </div>
    </div>
  );
};

export default EntityInfo;


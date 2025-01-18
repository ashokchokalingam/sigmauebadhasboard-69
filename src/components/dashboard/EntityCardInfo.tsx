import { Computer, User } from "lucide-react";

interface EntityCardInfoProps {
  id: string | null;
  isComputer: boolean;
  uniqueTitles: number;
}

const EntityCardInfo = ({ id, isComputer, uniqueTitles }: EntityCardInfoProps) => {
  return (
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
          {uniqueTitles} unique anomalies
        </span>
      </div>
    </div>
  );
};

export default EntityCardInfo;
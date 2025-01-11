import React from "react";
import { Computer, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityCardProps {
  id: string | null;
  eventCount?: number | null;
  uniqueTitles?: number | null;
  onClick: () => void;
}

const EntityCard = ({ id, eventCount = 0, uniqueTitles = 0, onClick }: EntityCardProps) => {
  const isComputer = id?.endsWith('$') ?? false;
  const safeEventCount = typeof eventCount === 'number' ? eventCount : 0;
  const safeUniqueTitles = typeof uniqueTitles === 'number' ? uniqueTitles : 0;
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-lg",
        "transition-all duration-300 cursor-pointer",
        "bg-[#1e2c3d]/40 hover:bg-[#1e2c3d]/60",
        "border border-blue-500/5 hover:border-blue-500/10"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10 rounded-full bg-blue-950/30 flex items-center justify-center">
          {isComputer ? (
            <Computer className="w-5 h-5 text-blue-400/70" />
          ) : (
            <User className="w-5 h-5 text-blue-400/70" />
          )}
        </div>
        
        <div className="flex flex-col">
          <span className="font-mono text-sm text-blue-200/90 font-medium group-hover:text-blue-100 truncate max-w-[300px]">
            {id || 'Unknown'}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-300/60">
              {safeUniqueTitles} unique anomalies
            </span>
            <span className="text-xs text-blue-400/30">•</span>
            <span className="text-xs text-blue-300/40">
              {safeEventCount.toLocaleString()} total events
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;
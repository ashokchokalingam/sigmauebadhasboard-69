import React from "react";
import { Activity, Computer, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityCardProps {
  id: string;
  eventCount: number;
  uniqueTitles: number;
  onClick: () => void;
}

const EntityCard = ({ id, eventCount, uniqueTitles, onClick }: EntityCardProps) => {
  // Get a consistent avatar number for each user (1-9)
  const avatarNumber = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 9) + 1;
  const isComputer = id.endsWith('$');
  
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col rounded-lg transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] transform-gpu"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-blue-950/90 to-indigo-950/90 backdrop-blur-sm border border-blue-500/20 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400/30 group-hover:border-purple-400/50 transition-colors bg-purple-950/50 flex items-center justify-center">
            {isComputer ? (
              <Computer className="w-6 h-6 text-purple-300" />
            ) : (
              <User className="w-6 h-6 text-purple-300" />
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-mono text-sm text-purple-100 font-semibold group-hover:text-white transition-colors">
              {id}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs font-medium text-purple-300">
                  {uniqueTitles} unique anomalies
                </span>
              </div>
              <span className="text-xs text-purple-400/70">•</span>
              <span className="text-xs text-purple-400/70">
                {eventCount.toLocaleString()} total events
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {uniqueTitles > 1 && (
            <span className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold",
              "bg-gradient-to-r from-purple-500/20 to-blue-500/20",
              "border border-purple-500/30",
              "text-purple-200",
              "animate-pulse"
            )}>
              Risk Watch
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntityCard;
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
  const avatarNumber = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 9) + 1;
  const isComputer = id.endsWith('$');
  
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col rounded-lg transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] transform-gpu"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#243949] to-[#517fa4] backdrop-blur-sm border border-blue-500/20 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400/30 group-hover:border-blue-400/50 transition-colors bg-blue-950/50 flex items-center justify-center">
            {isComputer ? (
              <Computer className="w-6 h-6 text-blue-300" />
            ) : (
              <User className="w-6 h-6 text-blue-300" />
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-mono text-sm text-blue-100 font-semibold group-hover:text-white transition-colors">
              {id}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs font-medium text-blue-300">
                  {uniqueTitles} unique anomalies
                </span>
              </div>
              <span className="text-xs text-blue-400/70">•</span>
              <span className="text-xs text-blue-400/70">
                {eventCount.toLocaleString()} total events
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {uniqueTitles > 1 && (
            <span className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold",
              "bg-gradient-to-r from-blue-500/20 to-blue-400/20",
              "border border-blue-500/30",
              "text-blue-200",
              "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
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
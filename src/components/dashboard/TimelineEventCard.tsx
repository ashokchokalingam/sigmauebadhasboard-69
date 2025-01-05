import { useState } from "react";
import { ChevronDown, Shield, AlertTriangle, Activity, Clock } from "lucide-react";
import { Alert } from "./types";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineMetadataGrid from "./TimelineMetadataGrid";
import TimelineRawLog from "./TimelineRawLog";
import { cn } from "@/lib/utils";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
}

const TimelineEventCard = ({ event, isLast }: TimelineEventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={cn(
      "relative",
      !isLast && "pb-6"
    )}>
      {!isLast && (
        <div className="absolute left-4 top-8 bottom-0 w-px bg-gradient-to-b from-purple-500/40 to-blue-500/40" />
      )}
      
      <div className="relative">
        <div className={cn(
          "absolute left-4 top-4 w-2 h-2 rounded-full",
          getSeverityColor(event.rule_level),
          "ring-4 ring-purple-500/10"
        )} />
        
        <div className="pl-8 space-y-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left group"
          >
            <div className="p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-400">
                    {event.rule_level?.toUpperCase() || 'INFO'}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:text-white",
                  isExpanded && "transform rotate-180"
                )} />
              </div>

              <h3 className="text-lg font-medium text-blue-100 group-hover:text-white transition-colors">
                {event.title || "Unknown Event"}
              </h3>
              
              <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                {event.description || "No description available"}
              </p>

              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1.5 text-blue-400/70">
                  <Clock className="h-4 w-4" />
                  {formatTime(event.system_time)}
                </div>
                {event.total_events && (
                  <div className="flex items-center gap-1.5 text-purple-400/70">
                    <Activity className="h-4 w-4" />
                    {event.total_events} events
                  </div>
                )}
              </div>
            </div>
          </button>

          <div className={cn(
            "space-y-4 overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <TimelineMitreSection alert={event} />
            <TimelineMetadataGrid alert={event} />
            <TimelineRawLog alert={event} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
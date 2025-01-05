import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

  return (
    <div className={cn(
      "relative",
      !isLast && "pb-4"
    )}>
      {!isLast && (
        <div className="absolute left-4 top-8 bottom-0 w-px bg-purple-500/20" />
      )}
      
      <div className="relative">
        <div className="absolute left-4 top-4 w-2 h-2 rounded-full bg-purple-500" />
        
        <div className="pl-8 space-y-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">
                {event.title || "Unknown Event"}
              </h3>
              <ChevronDown className={cn(
                "h-5 w-5 text-gray-400 transition-transform duration-200",
                isExpanded && "transform rotate-180"
              )} />
            </div>
            <p className="text-sm text-gray-400">
              {event.description || "No description available"}
            </p>
          </button>

          <div className={cn(
            "space-y-4 overflow-hidden transition-all duration-200",
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

import { Alert } from "./types";
import { cn } from "@/lib/utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineInstanceList from "./TimelineInstanceList";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import TimelineRawLog from "./TimelineRawLog";
import { getRiskLevel } from "./utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect: (id: string | null) => void;
  detailedLogs?: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  instances?: Alert[];
  isLoadingLogs?: boolean;
  selectedEventId: string | null;
}

const TimelineEventCard = ({ 
  event, 
  isLast, 
  isLatest,
  entityType,
  onSelect,
  detailedLogs,
  isExpanded,
  onToggleExpand,
  instances = [],
  isLoadingLogs = false,
  selectedEventId
}: TimelineEventCardProps) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const isSelected = selectedEventId === event.id;
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  const handleCardClick = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  return (
    <div className="group relative pl-4 w-full">
      <div className={cn(
        "absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2",
        color,
        "bg-background"
      )} />
      {!isLast && (
        <div className={cn(
          "absolute left-0 top-8 -ml-[1px] h-full w-[2px]",
          "bg-gradient-to-b from-current to-transparent",
          color
        )} />
      )}

      <div className="relative ml-4 mb-2">
        <div 
          className={cn(
            "rounded-lg border shadow-lg transition-all duration-300",
            cardBg,
            border,
            hover,
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75"
          )}
        >
          <div 
            onClick={handleCardClick}
            className="p-4 cursor-pointer hover:bg-slate-800/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronRight 
                className={cn(
                  "h-5 w-5 text-purple-400 transition-transform duration-200",
                  isDetailsExpanded && "transform rotate-90"
                )} 
              />
              <div className="flex-1">
                <TimelineEventHeader
                  ruleLevel={event.rule_level}
                  totalRecords={event.total_events || 0}
                  title={event.title}
                  description={event.description}
                />
              </div>
            </div>

            <TimelineEventTimestamps
              firstSeen={event.first_time_seen || event.system_time}
              lastSeen={event.last_time_seen || event.system_time}
            />

            {event.tags && <TimelineMitreSection tags={event.tags} />}
          </div>

          <div className={cn(
            "overflow-hidden transition-all duration-300",
            isDetailsExpanded ? "max-h-[2000px]" : "max-h-0"
          )}>
            <div className="border-t border-purple-500/20 p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-purple-400">Event ID:</span>
                    <span className="ml-2 text-gray-300">{event.event_id}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">Provider Name:</span>
                    <span className="ml-2 text-gray-300">{event.provider_name}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">Computer Name:</span>
                    <span className="ml-2 text-gray-300">{event.computer_name}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">Task:</span>
                    <span className="ml-2 text-gray-300">{event.task}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-purple-400">User ID:</span>
                    <span className="ml-2 text-gray-300">{event.user_id}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">IP Address:</span>
                    <span className="ml-2 text-gray-300">{event.ip_address || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">Risk Level:</span>
                    <span className="ml-2 text-gray-300">{event.rule_level}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">Risk Score:</span>
                    <span className="ml-2 text-gray-300">{event.risk}</span>
                  </div>
                </div>
              </div>

              <TimelineRawLog alert={event} />
            </div>
          </div>

          <TimelineInstanceList
            instances={instances}
            isExpanded={isExpanded || false}
            onToggle={() => onToggleExpand?.()}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

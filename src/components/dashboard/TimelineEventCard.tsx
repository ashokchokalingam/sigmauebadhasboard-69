
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineInstanceList from "./TimelineInstanceList";
import TimelineConnector from "./TimelineConnector";
import TimelineEventDetails from "./TimelineEventDetails";
import { getRiskLevel } from "./utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTimelineLogs } from "./hooks/useTimelineLogs";

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

  const { data: logsData, isLoading } = useTimelineLogs(
    entityType,
    event,
    isDetailsExpanded
  );

  const handleCardClick = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  return (
    <div className="group relative pl-4 w-full">
      <TimelineConnector color={color} isLast={isLast} />

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

          <TimelineEventDetails 
            isExpanded={isDetailsExpanded}
            event={event}
            isLoading={isLoading}
          />

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

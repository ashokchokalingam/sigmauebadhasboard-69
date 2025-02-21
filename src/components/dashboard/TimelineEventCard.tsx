
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "./utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineInstanceList from "./TimelineInstanceList";
import TimelineConnector from "./TimelineConnector";
import { useTimelineLogs } from "./hooks/useTimelineLogs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import ExpandedContent from "./TimelineEventDetails/ExpandedContent";

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
  isExpanded,
  onToggleExpand,
  instances = [],
  selectedEventId
}: TimelineEventCardProps) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  const { data: logsData, isLoading, error } = useTimelineLogs({
    entityType,
    event,
    enabled: isDetailsExpanded
  });

  const handleCardClick = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
    onSelect(event.id);
    console.log('Card clicked:', {
      entityType,
      event,
      isExpanded: !isDetailsExpanded
    });
  };

  return (
    <div className="group relative pl-4 w-full">
      <TimelineConnector color={color} isLast={isLast} />

      <div className="relative ml-4 mb-2">
        <div 
          className={cn(
            "rounded-lg border shadow-lg cursor-pointer",
            cardBg,
            border,
            hover,
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75"
          )}
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
        >
          <div className="p-4">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex-1">
                <TimelineEventHeader
                  ruleLevel={event.rule_level}
                  totalRecords={event.total_events || 0}
                  title={event.title}
                  description={event.description}
                />
              </div>
              <ChevronDown 
                className={cn(
                  "h-5 w-5 text-purple-400 transition-transform duration-200",
                  isDetailsExpanded && "transform rotate-180"
                )} 
              />
            </div>

            <TimelineEventTimestamps
              firstSeen={event.first_time_seen || event.system_time}
              lastSeen={event.last_time_seen || event.system_time}
            />

            {event.tags && <TimelineMitreSection tags={event.tags} />}
          </div>

          {isDetailsExpanded && (
            <ExpandedContent
              event={event}
              logsData={logsData}
              isLoading={isLoading}
              error={error as Error}
            />
          )}

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

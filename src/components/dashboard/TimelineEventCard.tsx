
import { Alert } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineInstanceList from "./TimelineInstanceList";
import { getRiskLevel } from "./utils";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect?: () => void;
  detailedLogs?: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  instances?: Alert[];
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
  instances = []
}: TimelineEventCardProps) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(); // Trigger the API call by calling onSelect first
    }
    setDetailsExpanded((prev) => !prev); // Then toggle the expanded state
  };

  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

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
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75",
            detailsExpanded && "border-opacity-50"
          )}
        >
          <div 
            onClick={handleCardClick}
            className="p-4 cursor-pointer"
          >
            <TimelineEventHeader
              ruleLevel={event.rule_level}
              totalRecords={event.total_events || 0}
              title={event.title}
              description={event.description}
            />

            <TimelineEventTimestamps
              firstSeen={event.first_time_seen || event.system_time}
              lastSeen={event.last_time_seen || event.system_time}
            />

            {event.tags && <TimelineMitreSection tags={event.tags} />}
          </div>

          <TimelineInstanceList
            instances={instances}
            isExpanded={isExpanded || false}
            onToggle={() => onToggleExpand?.()}
          />

          {detailsExpanded && detailedLogs && (
            <div className="border-t border-blue-500/10">
              <TimelineDetailedLogs
                logs={detailedLogs?.computer_impacted_logs || []}
                isLoading={false}
                totalRecords={detailedLogs?.pagination?.total_records || 0}
                entityType="computer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

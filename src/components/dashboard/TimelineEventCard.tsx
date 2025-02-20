
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
    setDetailsExpanded((prev) => !prev);
    if (onSelect) onSelect();
  };

  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  return (
    <div className="group relative pl-12">
      {/* Timeline dot */}
      <div className={cn(
        "absolute left-0 top-8 w-[14px] h-[14px] rounded-full",
        "border-[3px] border-[#1A1F2C]",
        color,
        "transition-all duration-300 group-hover:scale-125",
        isLatest && "w-[18px] h-[18px] ring-2 ring-blue-500/50 animate-pulse"
      )} />

      {/* Card content */}
      <div className={cn(
        "relative rounded-xl border shadow-lg transition-all duration-300",
        "backdrop-blur-xl bg-[#15161E]/60",
        border,
        hover,
        "group-hover:translate-x-1",
        isLatest && "ring-1 ring-blue-500/50"
      )}>
        <div 
          onClick={handleCardClick}
          className="relative overflow-hidden p-4 cursor-pointer"
        >
          {/* Glowing accent border */}
          <div className={cn(
            "absolute inset-x-0 top-0 h-[2px]",
            color,
            "opacity-50 group-hover:opacity-100 transition-opacity"
          )} />

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

          {event.tags && (
            <div className="mt-4 pt-4 border-t border-blue-500/10">
              <TimelineMitreSection tags={event.tags} />
            </div>
          )}
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
  );
};

export default TimelineEventCard;

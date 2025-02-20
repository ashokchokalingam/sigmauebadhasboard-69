
import { Alert } from "./types";
import { useState, useEffect } from "react";
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
  onSelect: (id: string | null) => void;
  detailedLogs?: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  instances?: Alert[];
  isLoadingLogs?: boolean;
  selectedEventId: string | null;
}

const generateEventId = (event: Alert): string => {
  // Generate a stable ID based on event properties
  const identifier = `${event.title}-${event.system_time}-${event.description?.slice(0, 20)}`;
  return btoa(identifier).replace(/[^a-zA-Z0-9]/g, '');
};

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
  // Generate a stable ID if one isn't provided
  const eventId = event.id || generateEventId(event);
  const isSelected = selectedEventId === eventId;
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  const handleCardClick = () => {
    console.log('Card clicked:', {
      eventId,
      isCurrentlySelected: isSelected,
      entityType,
      title: event.title,
      systemTime: event.system_time
    });

    onSelect(isSelected ? null : eventId);
  };

  // Map the entityType to the expected type for TimelineDetailedLogs
  const mappedEntityType = entityType === "computersimpacted" ? "computer" : "user";

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
            isSelected && "ring-2 ring-purple-500/50"
          )}
        >
          <div 
            onClick={handleCardClick}
            className="p-4 cursor-pointer hover:bg-slate-800/10 transition-colors"
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

          {isSelected && (
            <div className="border-t border-blue-500/10">
              {isLoadingLogs ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : detailedLogs ? (
                <TimelineDetailedLogs
                  logs={detailedLogs?.user_origin_logs || detailedLogs?.computer_impacted_logs || []}
                  isLoading={false}
                  totalRecords={detailedLogs?.pagination?.total_records || 0}
                  entityType={mappedEntityType}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

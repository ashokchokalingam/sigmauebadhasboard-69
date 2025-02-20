
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineInstanceList from "./TimelineInstanceList";
import { getRiskLevel } from "./utils";
import EventDetailsModal from "./EventDetailsModal";
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
  isExpanded,
  onToggleExpand,
  instances = [],
}: TimelineEventCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  const handleCardClick = () => {
    setIsModalOpen(true);
    console.log('Opening modal for:', {
      id: event.id,
      user_origin: event.user_origin,
      title: event.title
    });
  };

  return (
    <>
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
          </div>
        </div>
      </div>

      <EventDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
      />
    </>
  );
};

export default TimelineEventCard;

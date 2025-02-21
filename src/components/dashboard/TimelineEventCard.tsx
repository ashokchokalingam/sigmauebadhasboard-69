
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "./utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineConnector from "./TimelineConnector";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
}

const TimelineEventCard = ({ 
  event, 
  isLast, 
  isLatest,
  entityType,
}: TimelineEventCardProps) => {
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  return (
    <div className="group relative pl-4 w-full">
      <TimelineConnector color={color} isLast={isLast} />

      <div className="relative ml-4 mb-2">
        <div 
          className={cn(
            "rounded-lg border shadow-lg",
            cardBg,
            border,
            hover,
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75"
          )}
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
            </div>

            <TimelineEventTimestamps
              firstSeen={event.first_time_seen || event.system_time}
              lastSeen={event.last_time_seen || event.system_time}
            />

            {event.tags && <TimelineMitreSection tags={event.tags} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

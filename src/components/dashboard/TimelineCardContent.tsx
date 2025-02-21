
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import { Alert } from "./types";

interface TimelineCardContentProps {
  event: Alert;
  onClick: () => void;
}

const TimelineCardContent = ({ event, onClick }: TimelineCardContentProps) => {
  return (
    <div className="p-4" onClick={onClick}>
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
  );
};

export default TimelineCardContent;



import { Alert } from "./types";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineEventTimestamps from "./TimelineEventTimestamps";

interface TimelineCardContentProps {
  event: Alert;
  onClick?: () => void;
}

const TimelineCardContent = ({ event, onClick }: TimelineCardContentProps) => {
  console.log('TimelineCardContent event:', {
    title: event.title,
    totalEvents: event.total_events,
    instances: event.instances?.length
  });

  const safeSplit = (value: string | undefined) => {
    if (!value) return [];
    return value.split(',').map(t => t.trim()).filter(Boolean);
  };

  const tactics = safeSplit(event.tags);
  const techniques = tactics.filter(tag => tag.toLowerCase().includes('t1'));

  // Make sure to pass the total_events directly from the event object
  return (
    <div 
      onClick={onClick}
      className="p-4 space-y-4"
    >
      <TimelineEventHeader 
        ruleLevel={event.rule_level}
        totalRecords={event.total_events}
        title={event.title}
        description={event.description}
      />

      <TimelineMitreSection 
        tactics={tactics}
        techniques={techniques}
      />

      <TimelineEventTimestamps 
        firstSeen={event.first_time_seen}
        lastSeen={event.last_time_seen}
      />
    </div>
  );
};

export default TimelineCardContent;

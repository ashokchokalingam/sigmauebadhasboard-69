import { Alert } from "../types";
import TimelineEventCard from "../TimelineEventCard";
import InfiniteScrollLoader from "../InfiniteScrollLoader";

interface TimelineEventsProps {
  events: Alert[];
  hasNextPage: boolean;
  loaderRef: (node?: Element | null) => void;
}

const TimelineEvents = ({ events, hasNextPage, loaderRef }: TimelineEventsProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No timeline events found</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 w-full">
      {events.map((event, index) => (
        <TimelineEventCard
          key={`${event.id}-${index}`}
          event={event}
          isLast={index === events.length - 1}
        />
      ))}
      
      <InfiniteScrollLoader
        ref={loaderRef}
        hasMore={hasNextPage}
      />
    </div>
  );
};

export default TimelineEvents;
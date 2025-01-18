import { Alert } from "@/components/dashboard/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimelineEventCard from "../dashboard/TimelineEventCard";
import InfiniteScrollLoader from "../dashboard/InfiniteScrollLoader";

interface TimelineContentProps {
  allEvents: Alert[];
  entityType: string;
  isLoading: boolean;
  hasNextPage: boolean;
  loaderRef: (node?: Element | null) => void;
}

const TimelineContent = ({ 
  allEvents, 
  entityType, 
  isLoading, 
  hasNextPage,
  loaderRef 
}: TimelineContentProps) => {
  if (isLoading && allEvents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (allEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No timeline events found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6 w-full">
          <div className="relative space-y-6 w-full">
            {allEvents.map((event, index) => (
              <TimelineEventCard
                key={`${event.id}-${index}`}
                event={event}
                isLast={index === allEvents.length - 1}
                entityType={entityType}
              />
            ))}
            
            <InfiniteScrollLoader
              ref={loaderRef}
              hasMore={hasNextPage}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineContent;
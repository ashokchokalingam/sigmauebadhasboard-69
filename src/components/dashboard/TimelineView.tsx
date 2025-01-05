import { useInfiniteQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Alert } from "./types";
import TimelineEventCard from "./TimelineEventCard";
import TimelineEventTypes from "./TimelineEventTypes";
import TimelineGraph from "./TimelineGraph";
import TimelineControls from "./TimelineControls";
import TimeRangeSelector from "./TimeRangeSelector";
import InfiniteScrollLoader from "./InfiniteScrollLoader";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

const EVENTS_PER_PAGE = 500;

interface TimelineResponse {
  user_impacted_timeline: Alert[];
  pagination: {
    current_page: number;
    per_page: number;
    has_more: boolean;
  };
}

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const { ref, inView } = useInView();
  const [timeRange, setTimeRange] = useState("1h");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<TimelineResponse>({
    queryKey: ["timeline", entityType, entityId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/${entityType}_impacted_timeline?${entityType}_impacted=${entityId}&page=${pageParam}&per_page=${EVENTS_PER_PAGE}`
      );
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_more) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    enabled: !!entityId,
  });

  const allEvents = data?.pages.flatMap(
    (page) => page.user_impacted_timeline
  ) || [];

  if (inView && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Timeline</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <TimelineControls />
          <TimeRangeSelector 
            value={timeRange} 
            onChange={(value) => setTimeRange(value)} 
          />
          <TimelineGraph alerts={allEvents} />
          <TimelineEventTypes 
            alerts={allEvents}
            onEventTypeSelect={() => {}}
          />

          <div className="space-y-4">
            {allEvents.map((event, index) => (
              <TimelineEventCard
                key={`${event.id}-${index}`}
                event={event}
                isLast={index === allEvents.length - 1}
              />
            ))}
          </div>

          <InfiniteScrollLoader
            ref={ref}
            hasMore={!!hasNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
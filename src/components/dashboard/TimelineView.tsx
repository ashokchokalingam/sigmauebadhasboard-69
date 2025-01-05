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
  } = useInfiniteQuery({
    queryKey: ["timeline", entityType, entityId],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("Fetching timeline data:", { entityType, entityId, pageParam });
      const endpoint = entityType === "user" ? "user_impacted_timeline" : "computer_impacted_timeline";
      const response = await fetch(
        `/api/${endpoint}?${entityType === "user" ? "user_impacted" : "computer_name"}=${entityId}&page=${pageParam}&per_page=${EVENTS_PER_PAGE}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Timeline data received:", data);
      return data;
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

  console.log("All events:", allEvents);

  if (inView && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

  return (
    <div className={`flex flex-col ${inSidebar ? 'h-full' : 'min-h-screen bg-[#1A1F2C]'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Timeline for {entityId}</h2>
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
          {allEvents.length > 0 && <TimelineGraph alerts={allEvents} />}
          <TimelineEventTypes 
            alerts={allEvents}
            onEventTypeSelect={() => {}}
          />

          {isLoading && allEvents.length === 0 ? (
            <div className="text-center text-blue-400 py-8">Loading timeline data...</div>
          ) : allEvents.length === 0 ? (
            <div className="text-center text-blue-400 py-8">No events found for this entity</div>
          ) : (
            <div className="space-y-4">
              {allEvents.map((event, index) => (
                <TimelineEventCard
                  key={`${event.id}-${index}`}
                  event={event}
                  isLast={index === allEvents.length - 1}
                />
              ))}
            </div>
          )}

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
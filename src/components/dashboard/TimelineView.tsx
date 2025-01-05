import { useInfiniteQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Alert } from "./types";
import TimelineEventCard from "./TimelineEventCard";
import InfiniteScrollLoader from "./InfiniteScrollLoader";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "../ui/scroll-area";

const EVENTS_PER_PAGE = 500;

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const { ref, inView } = useInView();

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
      const queryParam = entityType === "user" ? "user_impacted" : "computer_name";
      
      const response = await fetch(
        `/api/${endpoint}?${queryParam}=${entityId}&page=${pageParam}&per_page=${EVENTS_PER_PAGE}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline data: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Timeline data received:", data);
      
      return {
        user_impacted_timeline: data.user_impacted_timeline || data.computer_impacted_timeline || [],
        pagination: {
          current_page: pageParam,
          per_page: EVENTS_PER_PAGE,
          has_more: (data.user_impacted_timeline || data.computer_impacted_timeline || []).length === EVENTS_PER_PAGE
        }
      };
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
    <div className={`flex flex-col ${inSidebar ? 'h-full' : 'min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#121212]'}`}>
      <div className="flex items-center justify-between p-6 border-b border-blue-500/10 bg-black/40">
        <h2 className="text-2xl font-bold text-blue-100">{entityId}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-4">
            {isLoading && allEvents.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : allEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No timeline events found</p>
              </div>
            ) : (
              <div className="relative space-y-4">
                {allEvents.map((event, index) => (
                  <TimelineEventCard
                    key={`${event.id}-${index}`}
                    event={event}
                    isLast={index === allEvents.length - 1}
                  />
                ))}
                
                <InfiniteScrollLoader
                  ref={ref}
                  hasMore={!!hasNextPage}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TimelineView;
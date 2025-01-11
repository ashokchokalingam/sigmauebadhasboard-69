import { useInfiniteQuery } from "@tanstack/react-query";
import { X, Shield } from "lucide-react";
import { Alert } from "./types";
import TimelineEventCard from "./TimelineEventCard";
import InfiniteScrollLoader from "./InfiniteScrollLoader";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "../ui/scroll-area";
import TimelineSummaryStats from "./TimelineComponents/TimelineSummaryStats";
import TimelineVisualizer from "./TimelineComponents/TimelineVisualizer";

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
      
      let endpoint = entityType === "computer" ? "computer_impacted_timeline" : "user_impacted_timeline";
      let queryParams = new URLSearchParams();
      
      if (entityType === "computer") {
        queryParams.append("computer_name", entityId);
      } else {
        queryParams.append("user_impacted", entityId);
      }
      
      queryParams.append("page", pageParam.toString());
      queryParams.append("per_page", EVENTS_PER_PAGE.toString());
      
      console.log(`Fetching from /api/${endpoint}?${queryParams.toString()}`);
      
      const response = await fetch(`/api/${endpoint}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline data: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Timeline data received:", data);
      
      return {
        computer_impacted_logs: data.computer_impacted_logs || [],
        user_impacted_timeline: data.user_impacted_timeline || [],
        pagination: {
          current_page: pageParam,
          per_page: EVENTS_PER_PAGE,
          has_more: (data.computer_impacted_logs?.length === EVENTS_PER_PAGE || 
                    data.user_impacted_timeline?.length === EVENTS_PER_PAGE)
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
    (page) => entityType === "computer" ? page.computer_impacted_logs : page.user_impacted_timeline
  ) || [];

  if (inView && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

  return (
    <div className={`flex flex-col ${inSidebar ? 'h-full' : 'min-h-screen w-full bg-gradient-to-br from-[#1A1F2C] to-[#121212]'}`}>
      <div className="flex items-center justify-between p-8 border-b border-blue-500/10 bg-black/40">
        <div className="flex items-center gap-4">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              {entityId}
            </h2>
            <p className="text-lg text-blue-300/80 mt-2">Security Timeline Analysis</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      <div className="p-6">
        <TimelineSummaryStats alerts={allEvents} />
      </div>

      <div className="px-6 pb-6">
        <TimelineVisualizer events={allEvents} />
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6 w-full">
            {isLoading && allEvents.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : allEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No timeline events found</p>
              </div>
            ) : (
              <div className="relative space-y-6 w-full">
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
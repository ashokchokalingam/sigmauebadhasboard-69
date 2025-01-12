import { useInfiniteQuery } from "@tanstack/react-query";
import { X, Shield } from "lucide-react";
import { Alert } from "./types";
import TimelineEventCard from "./TimelineEventCard";
import InfiniteScrollLoader from "./InfiniteScrollLoader";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "../ui/scroll-area";
import TimelineSummaryStats from "./TimelineComponents/TimelineSummaryStats";
import TimelineVisualizer from "./TimelineComponents/TimelineVisualizer";

interface TimelineViewProps {
  entityType: "user" | "computer" | "origin";
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
      
      let endpoint = "";
      let queryParams = new URLSearchParams();
      
      if (entityType === "origin") {
        endpoint = "user_origin_timeline";
        queryParams.append("user_origin", entityId);
      } else if (entityType === "computer") {
        endpoint = "computer_impacted_timeline";
        queryParams.append("computer_name", entityId);
      } else {
        endpoint = "user_impacted_timeline";
        queryParams.append("user_impacted", entityId);
      }
      
      queryParams.append("page", pageParam.toString());
      
      console.log(`Fetching from /api/${endpoint}?${queryParams.toString()}`);
      
      const response = await fetch(`/api/${endpoint}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline data: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Timeline data received:", data);
      
      return {
        events: data.user_origin_timeline || data.computer_impacted_timeline || data.user_impacted_timeline || [],
        pagination: {
          current_page: pageParam,
          has_more: data.events?.length === 50 // Assuming 50 is the page size
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

  const allEvents = data?.pages.flatMap((page) => page.events) || [];

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
                    entityType={entityType}
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
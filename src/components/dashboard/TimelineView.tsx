import { useInfiniteQuery } from "@tanstack/react-query";
import { X, Shield } from "lucide-react";
import { Alert } from "./types";
import SecurityTimeline from "./SecurityTimeline";
import { ScrollArea } from "../ui/scroll-area";

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
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
        `/api/${endpoint}?${queryParam}=${entityId}&page=${pageParam}&per_page=500`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline data: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Timeline data received:", data);
      
      return {
        user_impacted_timeline: data.user_impacted_timeline || [],
        pagination: {
          current_page: pageParam,
          per_page: 500,
          has_more: (data.user_impacted_timeline || []).length === 500
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

  if (isLoading && allEvents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${inSidebar ? 'h-full' : 'min-h-screen w-full bg-gradient-to-br from-[#1A1F2C] to-[#121212]'}`}>
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-white/5 rounded-lg transition-colors z-10"
        >
          <X className="h-6 w-6 text-gray-400" />
        </button>

        <SecurityTimeline 
          events={allEvents}
          userName={entityId}
        />
      </div>
    </div>
  );
};

export default TimelineView;
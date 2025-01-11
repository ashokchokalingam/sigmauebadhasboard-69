import { X, Shield } from "lucide-react";
import { Alert } from "./types";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import TimelineHeatmap from "./TimelineHeatmap";
import { useInfiniteQuery } from "@tanstack/react-query";
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
        alerts: data.alerts || [],
        pagination: {
          current_page: pageParam,
          per_page: 500,
          has_more: (data.alerts || []).length === 500
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

  const allAlerts = data?.pages.flatMap((page) => page.alerts) || [];

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
            <TimelineHeatmap alerts={allAlerts} />
            
            {isLoading && allAlerts.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : allAlerts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No timeline events found</p>
              </div>
            ) : (
              <TimelineDetailedLogs
                logs={allAlerts}
                isLoading={isFetchingNextPage}
                totalRecords={allAlerts.length}
              />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TimelineView;
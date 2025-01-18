import { useInfiniteQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useInView } from "react-intersection-observer";
import TimelineSummaryStats from "./TimelineComponents/TimelineSummaryStats";
import TimelineVisualizer from "./TimelineComponents/TimelineVisualizer";
import TimelineHeader from "../timeline/TimelineHeader";
import TimelineContent from "../timeline/TimelineContent";
import { formatTimelineData, getTimelineEndpoint } from "@/utils/timelineHelpers";

const EVENTS_PER_PAGE = 500;

interface TimelineViewProps {
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const { ref, inView } = useInView();

  console.log('TimelineView mounted with:', { entityType, entityId });

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
      
      const endpoint = getTimelineEndpoint(entityType);
      const queryParam = `${entityType.includes('user') ? 
        (entityType === 'userorigin' ? 'user_origin' : 'user_impacted') : 
        'computer_name'}=${entityId}`;
      
      console.log(`Fetching from ${endpoint}?${queryParam}`);
      
      const response = await fetch(`${endpoint}?${queryParam}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }

      const data = await response.json();
      console.log('Timeline data received:', data);
      
      return formatTimelineData(data);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_more) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    enabled: Boolean(entityType && entityId),
  });

  const allEvents = data?.pages.flatMap(
    (page) => entityType === "computersimpacted" ? page.computer_impacted_timeline : 
              entityType === "userorigin" ? page.user_origin_timeline :
              page.user_impacted_timeline
  ) || [];

  if (inView && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

  return (
    <div className={`flex flex-col ${inSidebar ? 'h-full' : 'min-h-screen w-full bg-gradient-to-br from-[#1A1F2C] to-[#121212]'}`}>
      <TimelineHeader entityId={entityId} onClose={onClose} />

      <div className="p-6">
        <TimelineSummaryStats alerts={allEvents} />
      </div>

      <div className="px-6 pb-6">
        <TimelineVisualizer events={allEvents} />
      </div>

      <TimelineContent
        allEvents={allEvents}
        entityType={entityType}
        isLoading={isLoading}
        hasNextPage={!!hasNextPage}
        loaderRef={ref}
      />
    </div>
  );
};

export default TimelineView;
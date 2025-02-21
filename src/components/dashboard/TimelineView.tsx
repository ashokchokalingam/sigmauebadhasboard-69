
import { useInfiniteQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useInView } from "react-intersection-observer";
import TimelineSummaryStats from "./TimelineComponents/TimelineSummaryStats";
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["timeline", entityType, entityId],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoints = {
        userorigin: '/api/user_origin_timeline',
        userimpacted: '/api/user_impacted_timeline',
        computersimpacted: '/api/computer_impacted_timeline'
      };

      const paramMappings = {
        userorigin: 'user_origin',
        userimpacted: 'user_impacted',
        computersimpacted: 'computer_name'
      };

      const endpoint = endpoints[entityType];
      const paramKey = paramMappings[entityType];

      console.log('Fetching timeline data:', {
        endpoint,
        paramKey,
        entityId,
        entityType
      });
      
      const params = new URLSearchParams({
        [paramKey]: entityId,
        page: pageParam.toString(),
        per_page: EVENTS_PER_PAGE.toString()
      });

      const response = await fetch(`${endpoint}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }

      const data = await response.json();
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
    (page) => {
      const eventMappings = {
        computersimpacted: page.computer_impacted_timeline,
        userorigin: page.user_origin_timeline,
        userimpacted: page.user_impacted_timeline
      };
      return eventMappings[entityType] || [];
    }
  ) || [];

  // Sort events by last_seen timestamp, then by first_seen if last_seen is equal
  const sortedEvents = [...allEvents].sort((a, b) => {
    const lastSeenA = new Date(a.last_time_seen || a.system_time).getTime();
    const lastSeenB = new Date(b.last_time_seen || b.system_time).getTime();
    
    if (lastSeenA === lastSeenB) {
      const firstSeenA = new Date(a.first_time_seen || a.system_time).getTime();
      const firstSeenB = new Date(b.first_time_seen || b.system_time).getTime();
      return firstSeenB - firstSeenA;
    }
    
    return lastSeenB - lastSeenA;
  });

  if (inView && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

  return (
    <div className="flex flex-col h-screen bg-[#1A1F2C]">
      <TimelineHeader entityId={entityId} onClose={onClose} />

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col space-y-4 p-6">
          <div className="flex-none">
            <TimelineSummaryStats alerts={sortedEvents} />
          </div>

          <div className="flex-1 min-h-0 bg-black/40 rounded-xl border border-blue-500/10">
            <TimelineContent
              allEvents={sortedEvents}
              entityType={entityType}
              isLoading={isLoading}
              hasNextPage={!!hasNextPage}
              loaderRef={ref}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;

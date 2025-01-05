import React, { useState, useEffect } from "react";
import TimelineHeader from "./TimelineComponents/TimelineHeader";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Alert, EventSummary, TimelineResponse } from "./types";
import { Card } from "@/components/ui/card";
import TimelineEventCard from "./TimelineEventCard";
import TimelineHistogram from "./TimelineHistogram/TimelineHistogram";
import TimeRangeSelector from "./TimeRangeSelector";
import InfiniteScrollLoader from "./InfiniteScrollLoader";
import { useInView } from "react-intersection-observer";

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const EVENTS_PER_PAGE = 500;

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const [timeRange, setTimeRange] = useState<string>('24h');
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['timeline', entityType, entityId, timeRange],
    queryFn: async ({ pageParam = 1 }) => {
      let endpoint = '';
      
      if (entityType === 'user') {
        endpoint = `/api/user_impacted_logs?user_impacted=${entityId}&page=${pageParam}&per_page=${EVENTS_PER_PAGE}`;
      } else if (entityType === 'computer') {
        endpoint = `/api/computer_impacted_timeline?computer_name=${entityId}&page=${pageParam}&per_page=${EVENTS_PER_PAGE}`;
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      const data = await response.json();
      console.log('Timeline data page:', pageParam, data);
      return data as TimelineResponse;
    },
    getNextPageParam: (lastPage, pages) => {
      if ((lastPage.user_impacted_timeline?.length || 0) === EVENTS_PER_PAGE) {
        return pages.length + 1;
      }
      return undefined;
    },
    enabled: Boolean(entityType && entityId),
    initialPageParam: 1
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allEvents = data?.pages.flatMap(page => page.user_impacted_timeline || []) || [];

  const content = (
    <div className="space-y-8">
      <TimelineHeader 
        entityType={entityType} 
        entityId={entityId} 
        onClose={onClose} 
        inSidebar={inSidebar}
      />

      <div className="flex justify-end">
        <TimeRangeSelector 
          value={timeRange} 
          onChange={(value) => setTimeRange(value)} 
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : allEvents.length > 0 ? (
        <div className="space-y-8">
          <TimelineHistogram alerts={allEvents as Alert[]} />
          
          <div className="space-y-4 mt-8">
            {allEvents.map((event: EventSummary, index: number) => (
              <TimelineEventCard key={`${event.id}-${index}`} event={event} />
            ))}
          </div>

          <InfiniteScrollLoader ref={ref} hasMore={hasNextPage || false} />
        </div>
      ) : (
        <Card className="bg-black/40 border-blue-500/10 p-8">
          <div className="text-center text-blue-300/70">
            No timeline events found for this entity
          </div>
        </Card>
      )}
    </div>
  );

  if (inSidebar) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-[#1A1F2C] overflow-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        {content}
      </div>
    </div>
  );
};

export default TimelineView;
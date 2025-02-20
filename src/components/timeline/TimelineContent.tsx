import { Alert } from "@/components/dashboard/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimelineEventCard from "../dashboard/TimelineEventCard";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

interface TimelineContentProps {
  allEvents: Alert[];
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  isLoading: boolean;
  hasNextPage: boolean;
  loaderRef: (node?: Element | null) => void;
}

interface GroupedEvent extends Alert {
  occurrences: number;
}

const TimelineContent = ({ 
  allEvents, 
  entityType, 
  isLoading, 
  hasNextPage,
  loaderRef 
}: TimelineContentProps) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Group and sort events
  const processedEvents = useMemo(() => {
    // First, group identical events
    const groupedEvents = allEvents.reduce((acc: GroupedEvent[], event) => {
      const existingEvent = acc.find(e => 
        e.title === event.title && 
        e.description === event.description &&
        e.rule_level === event.rule_level &&
        e.tags === event.tags
      );

      if (existingEvent) {
        existingEvent.occurrences = (existingEvent.occurrences || 1) + 1;
        // Keep the most recent timestamp
        if (new Date(event.last_time_seen || event.system_time) > 
            new Date(existingEvent.last_time_seen || existingEvent.system_time)) {
          existingEvent.last_time_seen = event.last_time_seen || event.system_time;
        }
        // Keep the earliest first_seen timestamp
        if (new Date(event.first_time_seen || event.system_time) < 
            new Date(existingEvent.first_time_seen || existingEvent.system_time)) {
          existingEvent.first_time_seen = event.first_time_seen || event.system_time;
        }
        existingEvent.total_events = (existingEvent.total_events || 1) + 1;
      } else {
        acc.push({
          ...event,
          occurrences: 1,
          total_events: event.total_events || 1
        });
      }
      return acc;
    }, []);

    // Sort by last_seen timestamp, then by first_seen if timestamps are equal
    return groupedEvents.sort((a, b) => {
      const lastSeenA = new Date(a.last_time_seen || a.system_time).getTime();
      const lastSeenB = new Date(b.last_time_seen || b.system_time).getTime();
      
      if (lastSeenA === lastSeenB) {
        const firstSeenA = new Date(a.first_time_seen || a.system_time).getTime();
        const firstSeenB = new Date(b.first_time_seen || b.system_time).getTime();
        return firstSeenB - firstSeenA; // Sort by first_seen in descending order if last_seen is equal
      }
      
      return lastSeenB - lastSeenA; // Sort by last_seen in descending order
    });
  }, [allEvents]);

  // Query for detailed logs
  const { data: detailedLogs } = useQuery({
    queryKey: ["detailed-logs", entityType, selectedEventId],
    queryFn: async () => {
      if (!selectedEventId) return null;
      
      const selectedEvent = allEvents.find(event => event.id === selectedEventId);
      if (!selectedEvent) return null;

      const baseUrl = entityType === "computersimpacted" ? '/api/computer_impacted_logs' :
                     entityType === "userorigin" ? '/api/user_origin_logs' :
                     '/api/user_impacted_logs';
      
      const params = new URLSearchParams();
      const identifier = entityType === "computersimpacted" ? selectedEvent.computer_name :
                        entityType === "userorigin" ? selectedEvent.user_origin :
                        selectedEvent.user_impacted;
      
      if (!identifier) {
        console.error('No identifier found for detailed logs');
        return null;
      }

      params.append(
        entityType === "computersimpacted" ? 'computer_name' :
        entityType === "userorigin" ? 'user_origin' :
        'user_impacted',
        identifier
      );
      
      params.append('title', selectedEvent.title);

      console.log('Fetching detailed logs:', {
        baseUrl,
        params: params.toString()
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch detailed logs');
      }
      
      return response.json();
    },
    enabled: !!selectedEventId
  });

  if (isLoading && allEvents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (allEvents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">No timeline events found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {processedEvents.map((event, index) => (
          <TimelineEventCard
            key={`${event.id}-${index}`}
            event={{
              ...event,
              total_events: event.occurrences || 1
            }}
            isLast={index === processedEvents.length - 1}
            entityType={entityType}
            onSelect={() => setSelectedEventId(event.id)}
            detailedLogs={event.id === selectedEventId ? detailedLogs : undefined}
          />
        ))}
        
        <div ref={loaderRef}>
          {hasNextPage && (
            <div className="py-4 text-center text-sm text-blue-400/60">
              Loading more events...
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default TimelineContent;

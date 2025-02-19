
import { Alert } from "@/components/dashboard/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimelineEventCard from "../dashboard/TimelineEventCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface TimelineContentProps {
  allEvents: Alert[];
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  isLoading: boolean;
  hasNextPage: boolean;
  loaderRef: (node?: Element | null) => void;
}

const TimelineContent = ({ 
  allEvents, 
  entityType, 
  isLoading, 
  hasNextPage,
  loaderRef 
}: TimelineContentProps) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // This query will only run when an event is selected
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
        {allEvents.map((event, index) => (
          <TimelineEventCard
            key={`${event.id}-${index}`}
            event={event}
            isLast={index === allEvents.length - 1}
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

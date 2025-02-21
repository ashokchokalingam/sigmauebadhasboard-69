
import { Alert } from "@/components/dashboard/types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TimelineControls from "./components/TimelineControls";
import TimelineEventList from "./components/TimelineEventList";
import { useProcessedEvents, SortOption, FilterOption } from "./hooks/useProcessedEvents";
import { toast } from "sonner";

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
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const processedEvents = useProcessedEvents(allEvents, sortBy, filterBy);

  const { data: detailedLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["detailed-logs", entityType, selectedEventId],
    queryFn: async () => {
      if (!selectedEventId) return null;
      
      const selectedEvent = allEvents.find(event => event.id === selectedEventId);
      if (!selectedEvent) {
        console.log('No event found with ID:', selectedEventId);
        return null;
      }

      // Log the event data to verify we have the correct information
      console.log('Selected event:', selectedEvent);

      // Construct the endpoint and params based on entity type
      let endpoint = '/api/user_origin_logs';
      const params = new URLSearchParams();

      if (entityType === "userorigin") {
        params.append("user_origin", selectedEvent.user_origin || '');
        params.append("title", selectedEvent.title || '');
        
        console.log('Fetching user origin logs with params:', {
          user_origin: selectedEvent.user_origin,
          title: selectedEvent.title
        });
      } else {
        // Handle other entity types similarly
        endpoint = entityType === "computersimpacted" 
          ? '/api/computer_impacted_logs'
          : '/api/user_impacted_logs';

        const paramKey = entityType === "computersimpacted" 
          ? "computer_name" 
          : "user_impacted";
        
        const paramValue = entityType === "computersimpacted"
          ? selectedEvent.computer_name
          : selectedEvent.user_impacted;

        params.append(paramKey, paramValue || '');
        params.append("title", selectedEvent.title || '');
      }

      const url = `${endpoint}?${params.toString()}`;
      console.log('Fetching logs from URL:', url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Received logs data:', data);
        
        // For user_origin_logs, the data is nested under a specific key
        return entityType === "userorigin" ? data.user_origin_logs : data;
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast.error("Failed to fetch detailed logs");
        throw error;
      }
    },
    enabled: !!selectedEventId,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Error in logs query:', error);
        }
      }
    }
  });

  console.log('Timeline Content Render:', {
    entityType,
    eventsCount: allEvents.length,
    processedEventsCount: processedEvents.length,
    selectedEventId,
    hasDetailedLogs: !!detailedLogs
  });

  const handleToggleExpand = (eventId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

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
    <div className="flex flex-col h-full">
      <TimelineControls
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={(value) => setSortBy(value)}
        onFilterChange={(value) => setFilterBy(value)}
      />
      
      <div className="flex-1 overflow-auto">
        <TimelineEventList
          events={processedEvents}
          entityType={entityType}
          selectedEventId={selectedEventId}
          expandedGroups={expandedGroups}
          detailedLogs={detailedLogs}
          onSelect={setSelectedEventId}
          onToggleExpand={handleToggleExpand}
          hasNextPage={hasNextPage}
          loaderRef={loaderRef}
          isLoadingLogs={isLoadingLogs}
        />
      </div>
    </div>
  );
};

export default TimelineContent;


import { Alert } from "@/components/dashboard/types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TimelineControls from "./components/TimelineControls";
import TimelineEventList from "./components/TimelineEventList";
import { useProcessedEvents, SortOption, FilterOption } from "./hooks/useProcessedEvents";

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
      if (!selectedEvent) return null;

      let identifier;
      if (entityType === "userorigin") {
        identifier = selectedEvent.user_origin;
      } else if (entityType === "userimpacted") {
        identifier = selectedEvent.user_impacted;
      } else {
        identifier = selectedEvent.computer_name;
      }

      // Build the API URL with query parameters
      const params = new URLSearchParams({
        [`${entityType === "computersimpacted" ? "computer_name" : "user_origin"}`]: identifier || '',
        title: selectedEvent.title
      });

      const endpoint = entityType === "computersimpacted" ? '/api/computer_impacted_logs' :
                      entityType === "userorigin" ? '/api/user_origin_logs' :
                      '/api/user_impacted_logs';

      console.log('Fetching logs:', {
        endpoint,
        params: params.toString(),
        entityType,
        identifier,
        title: selectedEvent.title
      });

      const response = await fetch(`${endpoint}?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      return response.json();
    },
    enabled: !!selectedEventId
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
  );
};

export default TimelineContent;

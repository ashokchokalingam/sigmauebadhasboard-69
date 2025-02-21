
import { Alert } from "@/components/dashboard/types";
import { useState, useEffect } from "react";
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
      console.log('queryFn executing with:', { selectedEventId, entityType });

      if (!selectedEventId) {
        return null;
      }
      
      const selectedEvent = allEvents.find(event => event.id === selectedEventId);
      if (!selectedEvent) {
        return null;
      }

      let endpoint = '/api/user_origin_logs';
      const params = new URLSearchParams();

      if (entityType === "userorigin") {
        if (!selectedEvent.user_origin || !selectedEvent.title) {
          toast.error("Missing required parameters");
          return null;
        }

        params.append("user_origin", selectedEvent.user_origin);
        params.append("title", selectedEvent.title);
      } else {
        endpoint = entityType === "computersimpacted" 
          ? '/api/computer_impacted_logs'
          : '/api/user_impacted_logs';

        const paramKey = entityType === "computersimpacted" 
          ? "computer_name" 
          : "user_impacted";
        
        const paramValue = entityType === "computersimpacted"
          ? selectedEvent.computer_name
          : selectedEvent.user_impacted;

        if (!paramValue) {
          toast.error("Missing required parameters");
          return null;
        }

        params.append(paramKey, paramValue);
        params.append("title", selectedEvent.title || '');
      }

      const url = `${endpoint}?${params.toString()}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }
        const data = await response.json();
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
        console.log('Query settled:', { hasData: !!data, error });
      }
    }
  });

  const handleSelect = (id: string | null) => {
    setSelectedEventId(id);
  };

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
          onSelect={handleSelect}
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

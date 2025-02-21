
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

  console.log('Timeline Content Render:', {
    entityType,
    eventsCount: allEvents.length,
    processedEventsCount: processedEvents.length,
    selectedEventId
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
          onSelect={setSelectedEventId}
          onToggleExpand={handleToggleExpand}
          hasNextPage={hasNextPage}
          loaderRef={loaderRef}
          isLoadingLogs={false}
        />
      </div>
    </div>
  );
};

export default TimelineContent;

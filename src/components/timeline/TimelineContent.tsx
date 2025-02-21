
import { Alert } from "@/components/dashboard/types";
import { useState, useCallback } from "react";
import TimelineControls from "./components/TimelineControls";
import TimelineEventList from "./components/TimelineEventList";
import LoadingSpinner from "./components/LoadingSpinner";
import EmptyState from "./components/EmptyState";
import { useProcessedEvents, SortOption, FilterOption } from "./hooks/useProcessedEvents";
import { useDetailedLogs } from "./hooks/useDetailedLogs";

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
  const { data: detailedLogs, isLoading: isLoadingLogs } = useDetailedLogs(
    selectedEventId,
    entityType,
    allEvents
  );

  const handleSelect = useCallback((id: string | null) => {
    // If clicking the same card, just toggle it
    if (id === selectedEventId) {
      setSelectedEventId(null);
      setExpandedGroups(new Set());
    } else {
      // If clicking a different card, select it and clear any expanded groups
      setSelectedEventId(id);
      setExpandedGroups(new Set());
    }
  }, [selectedEventId]);

  const handleToggleExpand = useCallback((eventId: string) => {
    setExpandedGroups(prev => {
      // Create a new empty set (clears all previous expansions)
      const newSet = new Set<string>();
      
      // Only add this eventId if it wasn't already expanded
      if (!prev.has(eventId)) {
        newSet.add(eventId);
      }
      
      return newSet;
    });
  }, []);

  if (isLoading && allEvents.length === 0) {
    return <LoadingSpinner />;
  }

  if (allEvents.length === 0) {
    return <EmptyState />;
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

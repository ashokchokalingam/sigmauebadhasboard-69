
import { Alert } from "@/components/dashboard/types";
import { useState } from "react";
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

  const processedEvents = useProcessedEvents(allEvents, sortBy, filterBy);
  const { data: detailedLogs, isLoading: isLoadingLogs } = useDetailedLogs(
    selectedEventId,
    entityType,
    allEvents
  );

  const handleSelect = (id: string | null) => {
    setSelectedEventId(currentId => currentId === id ? null : id);
  };

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
          detailedLogs={detailedLogs}
          onSelect={handleSelect}
          hasNextPage={hasNextPage}
          loaderRef={loaderRef}
          isLoadingLogs={isLoadingLogs}
        />
      </div>
    </div>
  );
};

export default TimelineContent;

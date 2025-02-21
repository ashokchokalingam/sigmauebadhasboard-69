
import { Alert } from "@/components/dashboard/types";
import TimelineEventCard from "@/components/dashboard/TimelineEventCard";

interface TimelineEventListProps {
  events: Alert[];
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  selectedEventId: string | null;
  detailedLogs: any;
  onSelect: (id: string | null) => void;
  hasNextPage: boolean;
  loaderRef: (node?: Element | null) => void;
  isLoadingLogs: boolean;
}

const TimelineEventList = ({
  events,
  entityType,
  selectedEventId,
  detailedLogs,
  onSelect,
  hasNextPage,
  loaderRef,
  isLoadingLogs
}: TimelineEventListProps) => {
  return (
    <div className="space-y-2 px-4 py-2">
      {events.map((event, index) => (
        <TimelineEventCard
          key={event.id}
          event={event}
          isLast={index === events.length - 1}
          isLatest={index === 0}
          entityType={entityType}
          onSelect={onSelect}
          selectedEventId={selectedEventId}
          detailedLogs={detailedLogs}
          isLoadingLogs={isLoadingLogs}
        />
      ))}
      {hasNextPage && (
        <div ref={loaderRef} className="h-10" />
      )}
    </div>
  );
};

export default TimelineEventList;

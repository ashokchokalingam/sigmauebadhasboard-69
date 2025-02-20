
import { Alert } from "@/components/dashboard/types";
import TimelineEventCard from "../../dashboard/TimelineEventCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimelineEventListProps {
  events: Alert[];
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  selectedEventId: string | null;
  expandedGroups: Set<string>;
  detailedLogs: any;
  onSelect: (id: string | null) => void;
  onToggleExpand: (id: string) => void;
  hasNextPage: boolean;
  loaderRef: (node?: Element | null) => void;
  isLoadingLogs: boolean;
}

const TimelineEventList = ({
  events,
  entityType,
  selectedEventId,
  expandedGroups,
  detailedLogs,
  onSelect,
  onToggleExpand,
  hasNextPage,
  loaderRef,
  isLoadingLogs
}: TimelineEventListProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-2">
        {events.map((event, index) => (
          <TimelineEventCard
            key={`${event.id}-${index}`}
            event={event}
            isLast={index === events.length - 1}
            entityType={entityType}
            onSelect={onSelect}
            detailedLogs={event.id === selectedEventId ? detailedLogs : undefined}
            isExpanded={expandedGroups.has(event.id)}
            onToggleExpand={() => onToggleExpand(event.id)}
            isLatest={index === 0}
            instances={event.instances}
            isLoadingLogs={isLoadingLogs && event.id === selectedEventId}
            selectedEventId={selectedEventId}
          />
        ))}
        
        <div ref={loaderRef}>
          {hasNextPage && (
            <div className="py-2 text-center text-sm text-blue-400/60">
              Loading more events...
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default TimelineEventList;

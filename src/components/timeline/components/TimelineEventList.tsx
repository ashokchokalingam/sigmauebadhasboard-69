
import { Alert } from "@/components/dashboard/types";
import TimelineEventCard from "../../dashboard/TimelineEventCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimelineEventListProps {
  events: Alert[];
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  selectedEventId: string | null;
  expandedGroups: Set<string>;
  detailedLogs: any;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  hasNextPage: boolean;
  loaderRef: (node?: Element | null) => void;
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
  loaderRef
}: TimelineEventListProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="relative p-6 space-y-6">
        {/* Vertical timeline line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent" />
        
        {events.map((event, index) => (
          <div
            key={`${event.id}-${index}`}
            className={`relative transition-all duration-500 transform ${
              index === 0 ? 'scale-100' : 'hover:scale-[1.02]'
            }`}
          >
            <TimelineEventCard
              event={event}
              isLast={index === events.length - 1}
              entityType={entityType}
              onSelect={() => onSelect(event.id)}
              detailedLogs={event.id === selectedEventId ? detailedLogs : undefined}
              isExpanded={expandedGroups.has(event.id)}
              onToggleExpand={() => onToggleExpand(event.id)}
              isLatest={index === 0}
              instances={event.instances}
            />
          </div>
        ))}
        
        <div ref={loaderRef}>
          {hasNextPage && (
            <div className="py-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default TimelineEventList;

import { Alert } from "./types";
import TimelineEventTypes from "./TimelineEventTypes";
import TimelineEventSummary from "./TimelineEventSummary";
import { useEventSummary } from "./hooks/useEventSummary";

interface TimelineContentProps {
  alerts: Alert[];
  expandedAlert: string | null;
  selectedEventType: string | null;
  onEventTypeSelect: (type: string | null) => void;
  onToggleRaw: (alertId: string, event: React.MouseEvent) => void;
  entityType: "user" | "computer";
  entityId: string;
  timeframe: string;
}

const TimelineContent = ({ 
  entityType,
  entityId,
  timeframe,
  selectedEventType,
  onEventTypeSelect,
}: TimelineContentProps) => {
  const { data: summaryData, isLoading: isLoadingSummary } = useEventSummary(
    entityType === "user" ? "target" : entityType,
    entityId,
    timeframe
  );

  const filteredSummary = summaryData?.event_summary.filter(event => 
    !selectedEventType || event.title === selectedEventType
  ) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="bg-black/40 border border-blue-500/10 rounded-xl p-4">
          <TimelineEventSummary 
            summary={filteredSummary}
            isLoading={isLoadingSummary}
            entityType={entityType}
          />
        </div>
      </div>

      <div>
        <div className="bg-black/40 border border-blue-500/10 rounded-xl p-4">
          <TimelineEventTypes 
            alerts={[]}  // We'll update this later when needed
            onEventTypeSelect={onEventTypeSelect}
            selectedEventType={selectedEventType}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineContent;
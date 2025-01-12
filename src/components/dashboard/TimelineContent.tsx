import { Alert } from "./types";
import TimelineEventSummary from "./TimelineEventSummary";
import { useEventSummary } from "./hooks/useEventSummary";

interface TimelineContentProps {
  alerts: Alert[];
  expandedAlert: string | null;
  selectedEventType: string | null;
  onEventTypeSelect: (type: string | null) => void;
  onToggleRaw: (alertId: string, event: React.MouseEvent) => void;
  entityType: "user" | "computer" | "origin";
  entityId: string;
  timeframe: string;
}

const TimelineContent = ({ 
  entityType,
  entityId,
  timeframe,
}: TimelineContentProps) => {
  const { data: summaryData, isLoading: isLoadingSummary } = useEventSummary(
    entityType,
    entityId,
    timeframe
  );

  return (
    <div className="w-full">
      <div className="bg-black/40 border border-blue-500/10 rounded-xl p-4">
        <TimelineEventSummary 
          summary={summaryData?.event_summary || []}
          isLoading={isLoadingSummary}
          entityType={entityType}
        />
      </div>
    </div>
  );
};

export default TimelineContent;
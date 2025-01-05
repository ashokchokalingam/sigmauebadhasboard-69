import { Alert } from "../types";
import TimelineEventCard from "../TimelineEventCard";
import TimelineEventTypes from "../TimelineEventTypes";
import TimelineGraph from "../TimelineGraph";
import TimelineEventSummary from "../TimelineEventSummary";
import { useEventSummary } from "../hooks/useEventSummary";

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
  alerts, 
  expandedAlert, 
  selectedEventType, 
  onEventTypeSelect,
  onToggleRaw,
  entityType,
  entityId,
  timeframe
}: TimelineContentProps) => {
  const filteredAlerts = alerts
    .filter(alert => !selectedEventType || alert.title === selectedEventType)
    .sort((a: Alert, b: Alert) => 
      new Date(b.system_time).getTime() - new Date(a.system_time).getTime()
    );

  const { data: summaryData, isLoading: isLoadingSummary } = useEventSummary(
    entityType === "user" ? "target" : entityType,
    entityId,
    timeframe
  );

  return (
    <>
      <div className="bg-black/40 border border-blue-500/10 rounded-xl p-4 mb-4">
        <h2 className="text-lg font-semibold text-blue-100 mb-4">Activity Overview</h2>
        <div className="h-[200px]">
          <TimelineGraph alerts={filteredAlerts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-black/40 border border-blue-500/10 rounded-xl p-4 mb-4">
            <TimelineEventSummary 
              summary={summaryData?.event_summary || []}
              isLoading={isLoadingSummary}
            />
          </div>
        </div>

        <div>
          <div className="bg-black/40 border border-blue-500/10 rounded-xl p-4 mb-4">
            <TimelineEventTypes 
              alerts={filteredAlerts} 
              onEventTypeSelect={onEventTypeSelect}
              selectedEventType={selectedEventType}
            />
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-blue-500/20" />
        <div className="space-y-6">
          {filteredAlerts.map((alert: Alert, index: number) => (
            <TimelineEventCard
              key={alert.id}
              alert={alert}
              isExpanded={expandedAlert === alert.id}
              onToggleRaw={onToggleRaw}
              isFirst={index === 0}
            />
          ))}
          {filteredAlerts.length === 0 && (
            <div className="text-center text-lg text-blue-400/60 py-8">
              No events found for the selected filters
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TimelineContent;
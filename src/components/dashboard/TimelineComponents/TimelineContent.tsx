import { Alert } from "../types";
import TimelineEventCard from "../TimelineEventCard";
import TimelineEventTypes from "../TimelineEventTypes";
import TimelineGraph from "../TimelineGraph";

interface TimelineContentProps {
  alerts: Alert[];
  expandedAlert: string | null;
  selectedEventType: string | null;
  onEventTypeSelect: (type: string | null) => void;
  onToggleRaw: (alertId: string, event: React.MouseEvent) => void;
}

const TimelineContent = ({ 
  alerts, 
  expandedAlert, 
  selectedEventType, 
  onEventTypeSelect,
  onToggleRaw 
}: TimelineContentProps) => {
  const filteredAlerts = alerts
    .filter(alert => !selectedEventType || alert.title === selectedEventType)
    .sort((a: Alert, b: Alert) => 
      new Date(b.system_time).getTime() - new Date(a.system_time).getTime()
    );

  return (
    <>
      <div className="bg-black/40 border border-purple-500/10 rounded-xl p-4 mb-4">
        <h2 className="text-lg font-semibold text-purple-100 mb-2">Activity Overview</h2>
        <div className="h-[200px]">
          <TimelineGraph alerts={filteredAlerts} />
        </div>
      </div>

      <div className="bg-black/40 border border-purple-500/10 rounded-xl p-4 mb-4">
        <h2 className="text-lg font-semibold text-purple-100 mb-2">Event Types</h2>
        <TimelineEventTypes 
          alerts={filteredAlerts} 
          onEventTypeSelect={onEventTypeSelect}
          selectedEventType={selectedEventType}
        />
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-purple-500/20" />
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
            <div className="text-center text-lg text-purple-400/60 py-8">
              No events found for the selected filters
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TimelineContent;
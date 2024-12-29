import { Activity } from "lucide-react";
import { Alert } from "./types";
import TimelineEventTypeCard from "./TimelineEventTypeCard";
import { calculateEventMetrics } from "./timelineUtils";

interface TimelineEventTypesProps {
  alerts: Alert[];
  onEventTypeSelect?: (title: string | null) => void;
  selectedEventType?: string | null;
}

const TimelineEventTypes = ({ alerts, onEventTypeSelect, selectedEventType }: TimelineEventTypesProps) => {
  const sortedMetrics = calculateEventMetrics(alerts);

  const handleEventTypeClick = (title: string) => {
    if (onEventTypeSelect) {
      onEventTypeSelect(selectedEventType === title ? null : title);
    }
  };

  return (
    <div className="mb-6 w-full">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-400" />
        Event Types
      </h3>
      <div className="grid gap-3">
        {sortedMetrics.map((metric) => (
          <TimelineEventTypeCard
            key={metric.type}
            metric={metric}
            isSelected={selectedEventType === metric.type}
            onSelect={handleEventTypeClick}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineEventTypes;
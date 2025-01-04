import { useState } from "react";
import TimelineHeader from "./TimelineComponents/TimelineHeader";
import TimelineLoader from "./TimelineComponents/TimelineLoader";
import TimelineContent from "./TimelineComponents/TimelineContent";
import LoadMoreButton from "./TimelineComponents/LoadMoreButton";
import TimeRangeSelector from "./TimeRangeSelector";
import { useTimelineData } from "./hooks/useTimelineData";

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [timeframe, setTimeframe] = useState("24h");

  const { alerts, isLoading } = useTimelineData(entityType, entityId, page, timeframe);

  const toggleRawLog = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    setPage(1); // Reset pagination when timeframe changes
  };

  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <TimelineHeader 
          entityType={entityType} 
          entityId={entityId} 
          onClose={onClose} 
          inSidebar={inSidebar} 
        />
        <TimeRangeSelector
          value={timeframe}
          onChange={handleTimeframeChange}
        />
      </div>

      {isLoading ? (
        <TimelineLoader />
      ) : alerts.length === 0 ? (
        <div className="text-center text-purple-400/60 py-8">
          No events found for this {entityType}
        </div>
      ) : (
        <TimelineContent
          alerts={alerts}
          expandedAlert={expandedAlert}
          selectedEventType={selectedEventType}
          onEventTypeSelect={setSelectedEventType}
          onToggleRaw={toggleRawLog}
        />
      )}

      <LoadMoreButton 
        show={alerts.length >= 5000}
        onLoadMore={() => setPage(p => p + 1)}
      />
    </>
  );

  if (inSidebar) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-[#1A1F2C] overflow-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        {content}
      </div>
    </div>
  );
};

export default TimelineView;
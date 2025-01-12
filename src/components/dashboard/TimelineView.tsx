import React, { useState } from "react";
import TimelineContent from "./TimelineContent";
import TimelineHeader from "./TimelineComponents/TimelineHeader";

interface TimelineViewProps {
  entityType: "user" | "computer" | "origin";
  entityId: string;
  onClose?: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar }: TimelineViewProps) => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [timeframe] = useState("24h");

  const handleToggleRaw = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  return (
    <div className="space-y-4">
      <TimelineHeader
        entityType={entityType === "origin" ? "user" : entityType}
        entityId={entityId}
        onClose={onClose}
        inSidebar={inSidebar}
      />
      
      <TimelineContent
        alerts={[]}
        expandedAlert={expandedAlert}
        selectedEventType={selectedEventType}
        onEventTypeSelect={setSelectedEventType}
        onToggleRaw={handleToggleRaw}
        entityType={entityType}
        entityId={entityId}
        timeframe={timeframe}
      />
    </div>
  );
};

export default TimelineView;
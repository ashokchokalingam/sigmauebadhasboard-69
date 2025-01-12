import React from "react";
import { X } from "lucide-react";
import TimelineContent from "./TimelineContent";

interface TimelineViewProps {
  entityType: "user" | "computer" | "origin";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const adjustedEntityType = entityType === "origin" ? "user" : entityType;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-100/90">Timeline View</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-blue-500/10 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-blue-400/70" />
        </button>
      </div>

      <TimelineContent
        alerts={[]}
        expandedAlert={null}
        selectedEventType={null}
        onEventTypeSelect={() => {}}
        onToggleRaw={() => {}}
        entityType={adjustedEntityType}
        entityId={entityId}
        timeframe="24h"
      />
    </div>
  );
};

export default TimelineView;
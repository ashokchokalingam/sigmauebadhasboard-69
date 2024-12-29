import { Alert } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, User, X } from "lucide-react";
import { useState } from "react";
import TimelineEventCard from "./TimelineEventCard";
import TimelineEventTypes from "./TimelineEventTypes";

interface TimelineViewProps {
  alerts: Alert[];
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
}

const TimelineView = ({ alerts, entityType, entityId, onClose }: TimelineViewProps) => {
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);

  // Filter alerts for the specific entity and event type
  const filteredAlerts = alerts
    .filter(alert => 
      entityType === "user" 
        ? alert.user_id === entityId
        : alert.computer_name === entityId
    )
    .filter(alert => !selectedEventType || alert.title === selectedEventType)
    .sort((a, b) => new Date(b.system_time).getTime() - new Date(a.system_time).getTime());

  const toggleRawLog = (alertId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  return (
    <div className="flex gap-4">
      <Card className="bg-black/40 border-blue-500/10 w-[800px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-blue-100 flex items-center gap-2">
            {entityType === "user" ? (
              <User className="h-5 w-5 text-blue-500" />
            ) : (
              <Monitor className="h-5 w-5 text-blue-500" />
            )}
            {entityId} Timeline
          </CardTitle>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-blue-400" />
          </button>
        </CardHeader>
        <CardContent>
          {/* Event Types Section */}
          <TimelineEventTypes 
            alerts={filteredAlerts} 
            onEventTypeSelect={setSelectedEventType}
            selectedEventType={selectedEventType}
          />

          {/* Timeline Events */}
          <div className="relative mt-6">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-blue-500/20" />
            <div className="space-y-8">
              {filteredAlerts.map((alert, index) => (
                <TimelineEventCard
                  key={alert.id}
                  alert={alert}
                  isExpanded={expandedAlert === alert.id}
                  onToggleRaw={toggleRawLog}
                  isFirst={index === 0}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineView;
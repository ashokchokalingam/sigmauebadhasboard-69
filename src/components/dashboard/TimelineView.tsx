import { Alert } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, User, X } from "lucide-react";
import { useState } from "react";
import TimelineEventCard from "./TimelineEventCard";
import TimelineEventTypes from "./TimelineEventTypes";
import TimelineGraph from "./TimelineGraph";

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
    <div className="fixed inset-0 bg-[#1A1F2C] overflow-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {entityType === "user" ? (
              <User className="h-8 w-8 text-blue-500" />
            ) : (
              <Monitor className="h-8 w-8 text-blue-500" />
            )}
            <h1 className="text-3xl font-bold text-blue-100">
              {entityId} Timeline
            </h1>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-blue-500/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-blue-400" />
          </button>
        </div>

        {/* Activity Graph with reduced height */}
        <div className="bg-black/40 border border-blue-500/10 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-100 mb-4">Activity Overview</h2>
          <div className="h-[250px]"> {/* Reduced from 400px to 250px */}
            <TimelineGraph alerts={filteredAlerts} />
          </div>
        </div>

        {/* Event Types Section with larger text */}
        <div className="bg-black/40 border border-blue-500/10 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-100 mb-4">Event Types</h2>
          <TimelineEventTypes 
            alerts={filteredAlerts} 
            onEventTypeSelect={setSelectedEventType}
            selectedEventType={selectedEventType}
          />
        </div>

        {/* Timeline Events */}
        <div className="relative">
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
            {filteredAlerts.length === 0 && (
              <div className="text-center text-xl text-blue-400/60 py-12">
                No events found for the selected filters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
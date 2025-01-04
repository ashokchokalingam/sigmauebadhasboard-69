import { Alert } from "./types";
import { Card } from "@/components/ui/card";
import { Monitor, User, X } from "lucide-react";
import { useState } from "react";
import TimelineEventCard from "./TimelineEventCard";
import TimelineEventTypes from "./TimelineEventTypes";
import TimelineGraph from "./TimelineGraph";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";

interface TimelineViewProps {
  alerts: Alert[];
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const apiEndpoint = entityType === "user" 
    ? `/api/user_origin_timeline?user_id=${encodeURIComponent(entityId)}&page=${page}`
    : `/api/computer_impacted_timeline?computer_name=${encodeURIComponent(entityId)}&page=${page}`;

  const { data: timelineData, isLoading, error } = useQuery({
    queryKey: ['timeline', entityType, entityId, page],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://172.16.0.75:5000';
      const response = await fetch(`${baseUrl}${apiEndpoint}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      return response.json();
    },
    meta: {
      onError: (error: Error) => {
        console.error('Timeline fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch timeline data. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  // Extract alerts from the response based on the endpoint
  const alerts = timelineData?.user_origin_timeline_logs || 
                timelineData?.computer_impacted_timeline_logs || 
                [];

  // Filter alerts based on selected event type
  const filteredAlerts = alerts
    .filter(alert => !selectedEventType || alert.title === selectedEventType)
    .sort((a: Alert, b: Alert) => 
      new Date(b.system_time).getTime() - new Date(a.system_time).getTime()
    );

  const toggleRawLog = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {entityType === "user" ? (
            <User className="h-6 w-6 text-purple-500" />
          ) : (
            <Monitor className="h-6 w-6 text-purple-500" />
          )}
          <h1 className="text-xl font-bold text-purple-100">
            {entityId} Timeline
          </h1>
        </div>
        {!inSidebar && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-purple-500/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-purple-400" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-8">
          Failed to load timeline data. Please try again.
        </div>
      ) : (
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
              onEventTypeSelect={setSelectedEventType}
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
                  onToggleRaw={toggleRawLog}
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

          {timelineData?.pagination?.has_more && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
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
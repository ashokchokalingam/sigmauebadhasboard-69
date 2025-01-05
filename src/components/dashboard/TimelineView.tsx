import React from "react";
import TimelineHeader from "./TimelineComponents/TimelineHeader";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock, Activity, Shield } from "lucide-react";
import TimelineGraph from "./TimelineGraph";
import { Alert } from "./types";

interface TimelineEvent {
  title: string;
  description: string;
  tags: string;
  first_time_seen: string;
  last_time_seen: string;
  total_events: number;
  user_impacted?: string;
}

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const { data: timelineData, isLoading } = useQuery({
    queryKey: ['timeline', entityType, entityId],
    queryFn: async () => {
      const response = await fetch(`/api/user_impacted_timeline?user_impacted=${entityId}`);
      if (!response.ok) throw new Error('Failed to fetch timeline data');
      const data = await response.json();
      return data.user_impacted_timeline as TimelineEvent[];
    }
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const content = (
    <div className="space-y-6">
      <TimelineHeader 
        entityType={entityType} 
        entityId={entityId} 
        onClose={onClose} 
        inSidebar={inSidebar}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : timelineData && timelineData.length > 0 ? (
        <div className="space-y-6">
          <div className="h-[300px] bg-black/40 border border-blue-500/10 rounded-xl p-4">
            <TimelineGraph alerts={timelineData as unknown as Alert[]} />
          </div>
          
          <div className="space-y-4">
            {timelineData.map((event, index) => (
              <Card 
                key={index} 
                className="stats-card group"
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-blue-100 flex items-center gap-2 group-hover:text-blue-300 transition-colors">
                        <AlertTriangle className="h-5 w-5 text-blue-400 stats-icon" />
                        {event.title}
                      </h3>
                      <p className="text-sm text-blue-300/70 group-hover:text-blue-300/90 transition-colors">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">
                        {event.total_events.toLocaleString()} events
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.tags.split(',').map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-blue-300/70">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>First seen: {formatDate(event.first_time_seen)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Last seen: {formatDate(event.last_time_seen)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="bg-black/40 border-blue-500/10 p-8">
          <div className="text-center text-blue-300/70">
            No timeline events found for this entity
          </div>
        </Card>
      )}
    </div>
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
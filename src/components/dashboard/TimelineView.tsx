import React from "react";
import TimelineHeader from "./TimelineComponents/TimelineHeader";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock, Activity } from "lucide-react";

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : timelineData && timelineData.length > 0 ? (
        <div className="space-y-4">
          {timelineData.map((event, index) => (
            <Card key={index} className="bg-[#1a2234] border-slate-700/50 hover:bg-[#1e2943] transition-all duration-300 p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-purple-100 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-purple-500" />
                      {event.title}
                    </h3>
                    <p className="text-sm text-purple-300/70">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full">
                    <Activity className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">
                      {event.total_events.toLocaleString()} events
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {event.tags.split(',').map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-purple-300/70">
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
      ) : (
        <Card className="bg-[#1a2234] border-slate-700/50 p-8">
          <div className="text-center text-purple-300/70">
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
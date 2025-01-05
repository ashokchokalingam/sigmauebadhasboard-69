import { Activity, Clock } from "lucide-react";
import { EventSummary } from "./types";
import { Card } from "../ui/card";

interface TimelineEventSummaryProps {
  summary: EventSummary[];
  isLoading: boolean;
}

const TimelineEventSummary = ({ summary, isLoading }: TimelineEventSummaryProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-blue-950/50 rounded-lg" />
        ))}
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-blue-100">
        <Activity className="h-5 w-5 text-blue-400" />
        Event Summary
      </div>
      
      {summary.map((event, index) => (
        <Card 
          key={index}
          className="p-4 bg-blue-950/30 border-blue-500/20 hover:bg-blue-950/40 transition-colors"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-100 font-medium">{event.title}</h3>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                {event.total_count} occurrences
              </span>
            </div>
            
            {event.description && (
              <p className="text-blue-300/70 text-sm">{event.description}</p>
            )}
            
            {event.tags && (
              <div className="flex flex-wrap gap-2">
                {event.tags.split(',').map((tag, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 bg-blue-950/50 text-blue-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-blue-300/70">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                First seen: {formatDateTime(event.first_seen)}
              </div>
              <div className="w-px h-4 bg-blue-500/20" />
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last seen: {formatDateTime(event.last_seen)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TimelineEventSummary;
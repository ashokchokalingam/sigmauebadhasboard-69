import { Activity, Clock } from "lucide-react";
import { EventSummary } from "./types";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

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
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                {event.total_events} events
              </Badge>
            </div>
            
            {event.description && (
              <p className="text-blue-300/70 text-sm">{event.description}</p>
            )}
            
            {event.tags && (
              <div className="flex flex-wrap gap-2">
                {event.tags.split(',').map((tag, i) => (
                  <Badge 
                    key={i}
                    variant="outline" 
                    className="bg-blue-950/50 text-blue-300 border-blue-500/20"
                  >
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-blue-300/70">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                First seen: {formatDateTime(event.first_time_seen)}
              </div>
              <div className="w-px h-4 bg-blue-500/20" />
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last seen: {formatDateTime(event.last_time_seen)}
              </div>
            </div>
          </div>
        </Card>
      ))}

      {summary.length === 0 && (
        <div className="text-center text-blue-300/70 py-8">
          No events found for this time period
        </div>
      )}
    </div>
  );
};

export default TimelineEventSummary;
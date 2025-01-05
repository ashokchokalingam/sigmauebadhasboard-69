import { Clock, Activity, AlertTriangle, Shield } from "lucide-react";
import { EventSummary } from "./types";
import { Card } from "../ui/card";
import { extractTacticsAndTechniques } from "./utils";

interface TimelineEventCardProps {
  event: EventSummary;
}

const TimelineEventCard = ({ event }: TimelineEventCardProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(event.tags);
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSeverityColor = (totalEvents: number) => {
    if (totalEvents > 10000) return "text-red-500";
    if (totalEvents > 1000) return "text-orange-500";
    return "text-yellow-500";
  };

  return (
    <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${getSeverityColor(event.total_events)}`} />
              <h3 className="text-lg font-medium text-blue-100">{event.title}</h3>
            </div>
            <p className="text-sm text-blue-300/70">
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
          {techniques.map((technique, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
            >
              {technique}
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
  );
};

export default TimelineEventCard;
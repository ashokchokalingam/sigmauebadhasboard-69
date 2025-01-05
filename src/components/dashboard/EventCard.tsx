import { Card } from "@/components/ui/card";
import { Clock, Activity, AlertTriangle } from "lucide-react";
import { EventSummary } from "./types";
import { extractTacticsAndTechniques } from "./utils";

interface EventCardProps {
  event: EventSummary;
}

const EventCard = ({ event }: EventCardProps) => {
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

  return (
    <Card className="bg-[#1a2234] border-slate-700/50 hover:bg-[#1e2943] transition-all duration-300 p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-blue-100">{event.title}</h3>
          <p className="text-sm text-blue-300/70 line-clamp-2">
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

      <div className="flex items-center justify-between text-sm text-blue-300/70">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>First seen: {formatDate(event.first_time_seen)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Last seen: {formatDate(event.last_time_seen)}</span>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
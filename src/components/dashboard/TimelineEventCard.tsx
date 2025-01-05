import { Clock, Activity, AlertTriangle, Shield } from "lucide-react";
import { EventSummary } from "./types";
import { Card } from "../ui/card";
import { extractTacticsAndTechniques } from "./utils";
import TimelineRawLog from "./TimelineRawLog";
import TimelineMetadataGrid from "./TimelineMetadataGrid";
import TimelineMitreSection from "./TimelineMitreSection";

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

  const getSeverityColor = (level: string = '') => {
    const l = level.toLowerCase();
    if (l.includes('critical')) return "text-[#FF4500] bg-[#FF4500]/10";
    if (l.includes('high')) return "text-[#FF8C00] bg-[#FF8C00]/10";
    if (l.includes('medium')) return "text-[#FFD700] bg-[#FFD700]/10";
    if (l.includes('low')) return "text-[#32CD32] bg-[#32CD32]/10";
    if (l.includes('informational')) return "text-[#1E90FF] bg-[#1E90FF]/10";
    return "text-blue-400 bg-blue-500/10";
  };

  const severityClass = getSeverityColor(event.rule_level);

  return (
    <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${severityClass.split(' ')[0]}`} />
              <h3 className="text-lg font-medium text-blue-100">{event.title}</h3>
            </div>
            <p className="text-sm text-blue-300/70">
              {event.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${severityClass}`}>
              {event.rule_level || 'Unknown'}
            </span>
            <div className="bg-blue-500/10 px-3 py-1.5 rounded-full flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                {event.total_events?.toLocaleString()} events
              </span>
            </div>
          </div>
        </div>

        <TimelineMetadataGrid alert={event} />
        
        <TimelineMitreSection alert={event} />

        <TimelineRawLog alert={event} />
      </div>
    </Card>
  );
};

export default TimelineEventCard;
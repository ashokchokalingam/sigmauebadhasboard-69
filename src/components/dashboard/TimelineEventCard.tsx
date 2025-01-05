import { Shield, AlertTriangle, Activity, Clock, Calendar, Info } from "lucide-react";
import { Alert } from "./types";
import TimelineMitreSection from "./TimelineMitreSection";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
}

const TimelineEventCard = ({ event, isLast }: TimelineEventCardProps) => {
  const getSeverityIcon = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'medium':
        return <Shield className="h-4 w-4 text-yellow-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="group relative pl-6">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-6 -ml-[5px] h-2.5 w-2.5 rounded-full border-2 border-blue-400 bg-background" />
      {!isLast && (
        <div className="absolute left-0 top-6 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-blue-400/50 to-transparent" />
      )}

      <div className="relative ml-6 mb-4">
        <div className="max-w-2xl p-3 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm">
          {/* Header Section with Severity and Event Count */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getSeverityIcon(event.rule_level)}
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                event.rule_level?.toLowerCase() === 'high' && "bg-orange-500/10 text-orange-400 border border-orange-500/20",
                event.rule_level?.toLowerCase() === 'medium' && "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
                event.rule_level?.toLowerCase() === 'informational' && "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              )}>
                {event.rule_level?.toUpperCase() || 'INFO'}
              </span>
              <div className="flex items-center gap-1 text-xs text-green-400/70">
                <Activity className="h-3 w-3" />
                <span>{event.total_events || 0} events</span>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-blue-100 mb-1 group-hover:text-blue-300 transition-colors">
              {event.title || "Unknown Event"}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {event.description || "No description available"}
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="flex items-center gap-1 text-blue-400/70">
              <Calendar className="h-3 w-3" />
              <span>First: {formatDateTime(event.first_time_seen || '')}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400/70">
              <Clock className="h-3 w-3" />
              <span>Last: {formatDateTime(event.last_time_seen || '')}</span>
            </div>
          </div>

          {/* MITRE ATT&CK Section */}
          <TimelineMitreSection alert={event} />
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
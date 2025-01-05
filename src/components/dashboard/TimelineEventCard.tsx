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
        return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      case 'medium':
        return <Shield className="h-5 w-5 text-yellow-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="group relative pl-14">
      {/* Timeline dot */}
      <div className="absolute left-[22px] top-4 w-2 h-2 rounded-full bg-blue-400 ring-4 ring-blue-400/20" />
      
      <div className="max-w-4xl p-4 rounded-xl bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm">
        {/* Header Section with Severity and Event Count */}
        <div className="flex items-center gap-3 mb-3">
          {getSeverityIcon(event.rule_level)}
          <span className={cn(
            "text-sm font-medium px-3 py-1 rounded-full",
            event.rule_level?.toLowerCase() === 'high' && "bg-orange-500/10 text-orange-400 border border-orange-500/20",
            event.rule_level?.toLowerCase() === 'medium' && "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
            event.rule_level?.toLowerCase() === 'informational' && "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          )}>
            {event.rule_level?.toUpperCase() || 'INFO'}
          </span>
          <div className="flex items-center gap-1.5 text-sm text-green-400/70">
            <Activity className="h-4 w-4" />
            <span>{event.total_events || 0} events detected</span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-medium text-blue-100 mb-2 group-hover:text-blue-300 transition-colors">
            {event.title || "Unknown Event"}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {event.description || "No description available"}
          </p>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-blue-400/70">
            <Calendar className="h-4 w-4" />
            <span>First: {formatDateTime(event.first_time_seen || '')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-400/70">
            <Clock className="h-4 w-4" />
            <span>Last: {formatDateTime(event.last_time_seen || '')}</span>
          </div>
        </div>

        {/* MITRE ATT&CK Section */}
        <TimelineMitreSection alert={event} />
      </div>
    </div>
  );
};

export default TimelineEventCard;
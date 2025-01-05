import { Shield, AlertTriangle, Activity, Clock, Calendar, Info } from "lucide-react";
import { Alert } from "./types";
import TimelineMitreSection from "./TimelineMitreSection";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
}

const TimelineEventCard = ({ event }: TimelineEventCardProps) => {
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
    <div className="space-y-2">
      <div className="p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getSeverityIcon(event.rule_level)}
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              event.rule_level?.toLowerCase() === 'high' && "bg-orange-500/10 text-orange-400",
              event.rule_level?.toLowerCase() === 'medium' && "bg-yellow-500/10 text-yellow-400",
              event.rule_level?.toLowerCase() === 'informational' && "bg-blue-500/10 text-blue-400"
            )}>
              {event.rule_level?.toUpperCase() || 'INFO'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-400/70">
            <Activity className="h-4 w-4" />
            <span>{event.total_events || 0} events</span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="text-base font-medium text-blue-100 mb-1">
            {event.title || "Unknown Event"}
          </h3>
          <p className="text-xs text-gray-400">
            {event.description || "No description available"}
          </p>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-blue-400/70">
            <Calendar className="h-3 w-3" />
            <span>First: {formatDateTime(event.first_time_seen || '')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400/70">
            <Clock className="h-3 w-3" />
            <span>Last: {formatDateTime(event.last_time_seen || '')}</span>
          </div>
        </div>

        {/* MITRE ATT&CK Section */}
        <TimelineMitreSection alert={event} />
        
        {/* Event Details */}
        <div className="mt-3 pt-3 border-t border-blue-500/10">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">User Impacted</span>
              <span className="text-blue-100 font-mono">{event.user_impacted || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Domain</span>
              <span className="text-blue-100 font-mono">{event.target_domain_name || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
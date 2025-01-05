import { useState } from "react";
import { ChevronDown, Shield, AlertTriangle, Activity, Clock, Calendar, Info } from "lucide-react";
import { Alert } from "./types";
import TimelineMitreSection from "./TimelineMitreSection";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
}

const TimelineEventCard = ({ event, isLast }: TimelineEventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left group"
      >
        <div className="p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300">
          {/* Header with Severity */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getSeverityIcon(event.rule_level)}
              <span className={cn(
                "text-sm font-medium px-2 py-1 rounded-full",
                event.rule_level?.toLowerCase() === 'high' && "bg-orange-500/10 text-orange-400",
                event.rule_level?.toLowerCase() === 'medium' && "bg-yellow-500/10 text-yellow-400",
                event.rule_level?.toLowerCase() === 'informational' && "bg-blue-500/10 text-blue-400"
              )}>
                {event.rule_level?.toUpperCase() || 'INFO'}
              </span>
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:text-white",
              isExpanded && "transform rotate-180"
            )} />
          </div>

          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-blue-100 group-hover:text-white transition-colors mb-2">
              {event.title || "Unknown Event"}
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              {event.description || "No description available"}
            </p>
          </div>

          {/* Event Metadata */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-blue-400/70">
              <Calendar className="h-4 w-4" />
              <span>First: {formatDateTime(event.first_time_seen || '')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-400/70">
              <Clock className="h-4 w-4" />
              <span>Last: {formatDateTime(event.last_time_seen || '')}</span>
            </div>
            {event.total_events && (
              <div className="flex items-center gap-1.5 text-green-400/70">
                <Activity className="h-4 w-4" />
                <span>{event.total_events} events</span>
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <div className={cn(
        "space-y-4 overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="bg-black/40 rounded-lg border border-blue-500/10 p-4">
          <TimelineMitreSection alert={event} />
          
          <div className="mt-4 pt-4 border-t border-blue-500/10">
            <h4 className="text-sm font-medium text-blue-400 mb-2">Event Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">User Impacted</span>
                  <span className="text-blue-100 font-mono">{event.user_impacted || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Events</span>
                  <span className="text-blue-100 font-mono">{event.total_events || '0'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Rule Level</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    event.rule_level?.toLowerCase() === 'high' && "bg-orange-500/10 text-orange-400",
                    event.rule_level?.toLowerCase() === 'medium' && "bg-yellow-500/10 text-yellow-400",
                    event.rule_level?.toLowerCase() === 'informational' && "bg-blue-500/10 text-blue-400"
                  )}>
                    {event.rule_level?.toUpperCase() || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Domain</span>
                  <span className="text-blue-100 font-mono">{event.target_domain_name || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
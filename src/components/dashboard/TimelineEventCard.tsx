import React, { useState } from 'react';
import { Shield, AlertTriangle, Activity, Clock, Calendar, Info, User } from "lucide-react";
import { Alert } from "./types";
import TimelineMitreSection from "./TimelineMitreSection";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "../ui/scroll-area";
import TimelineRawLog from "./TimelineRawLog";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
}

const TimelineEventCard = ({ event, isLast }: TimelineEventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: detailedLogs, isLoading } = useQuery({
    queryKey: ['detailed-logs', event.target_user_name, event.title, isExpanded],
    queryFn: async () => {
      if (!isExpanded) return null;
      
      const response = await fetch(
        `/api/user_impacted_logs?user_impacted=${encodeURIComponent(event.target_user_name || '')}&title=${encodeURIComponent(event.title || '')}&page=1&per_page=500`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch detailed logs');
      }
      
      return response.json();
    },
    enabled: isExpanded
  });

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
    <div className="group relative pl-6">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2 border-green-400 bg-background" />
      {!isLast && (
        <div className="absolute left-0 top-8 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-green-400/50 to-transparent" />
      )}

      <div className="relative ml-6 mb-6">
        <div 
          className={cn(
            "p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm cursor-pointer max-w-4xl",
            isExpanded && "border-green-500/30"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Header Section with Severity, Event Count, and User */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {getSeverityIcon(event.rule_level)}
              <span className={cn(
                "text-sm font-medium px-3 py-1 rounded-full",
                event.rule_level?.toLowerCase() === 'high' && "bg-orange-500/10 text-orange-400 border border-orange-500/20",
                event.rule_level?.toLowerCase() === 'medium' && "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
                event.rule_level?.toLowerCase() === 'informational' && "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              )}>
                {event.rule_level?.toUpperCase() || 'INFO'}
              </span>
              <div className="flex items-center gap-2 text-sm text-green-400/70">
                <Activity className="h-4 w-4" />
                <span>{event.total_events || 0} events</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-400/70">
                <User className="h-4 w-4" />
                <span>{event.target_user_name || 'Unknown User'}</span>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-blue-100 mb-2 group-hover:text-blue-300 transition-colors">
              {event.title || "Unknown Event"}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {event.description || "No description available"}
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2 text-blue-400/70">
              <Calendar className="h-4 w-4" />
              <span>First: {formatDateTime(event.first_time_seen || '')}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400/70">
              <Clock className="h-4 w-4" />
              <span>Last: {formatDateTime(event.last_time_seen || '')}</span>
            </div>
          </div>

          {/* MITRE ATT&CK Section */}
          <TimelineMitreSection alert={event} />

          {/* Detailed Logs Section */}
          {isExpanded && (
            <div className="mt-4 border-t border-blue-500/10 pt-4">
              <h4 className="text-sm font-medium text-blue-100 mb-2">Detailed Logs</h4>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                </div>
              ) : detailedLogs?.logs?.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {detailedLogs.logs.map((log: Alert, index: number) => (
                      <TimelineRawLog key={index} alert={log} />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-gray-400">No detailed logs available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
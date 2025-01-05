import { Shield, AlertTriangle, Activity, Clock, Calendar, Info } from "lucide-react";
import { Alert } from "./types";
import TimelineMitreSection from "./TimelineMitreSection";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "../ui/scroll-area";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
}

interface DetailedLogResponse {
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_records: number;
  };
  user_impacted_logs: Alert[];
}

const TimelineEventCard = ({ event, isLast }: TimelineEventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: detailedLogs, isLoading } = useQuery<DetailedLogResponse>({
    queryKey: ['detailed-logs', event.target_user_name, event.title, isExpanded],
    queryFn: async () => {
      if (!isExpanded) return null;
      
      // Ensure we have a user_impacted value
      if (!event.target_user_name) {
        console.error('No target_user_name provided for detailed logs query');
        return null;
      }

      const params = new URLSearchParams({
        user_impacted: event.target_user_name,
        title: event.title,
        page: '1',
        per_page: '500'
      });

      const response = await fetch(`/api/user_impacted_logs?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch logs:', errorData);
        throw new Error('Failed to fetch logs');
      }
      
      return response.json();
    },
    enabled: isExpanded && !!event.target_user_name
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

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="group relative pl-6">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2 border-green-400 bg-background" />
      {!isLast && (
        <div className="absolute left-0 top-8 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-green-400/50 to-transparent" />
      )}

      <div className="relative ml-6 mb-6 w-[75%]">
        <div 
          onClick={handleCardClick}
          className={cn(
            "p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm cursor-pointer",
            isExpanded && "border-blue-500/30"
          )}
        >
          {/* Header Section with Severity and Event Count */}
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
                <span>{detailedLogs?.pagination?.total_records || 0} events</span>
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
              <h4 className="text-blue-100 font-medium mb-3">Detailed Logs ({detailedLogs?.pagination?.total_records || 0} events)</h4>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : detailedLogs?.user_impacted_logs?.length > 0 ? (
                <ScrollArea className="h-[300px] w-full rounded-md border border-blue-500/10 p-4">
                  <div className="space-y-4">
                    {detailedLogs.user_impacted_logs.map((log, index) => (
                      <div key={index} className="p-3 rounded-md bg-black/20 border border-blue-500/5">
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(log).map(([key, value]) => (
                            <div key={key} className="mb-2">
                              <span className="text-blue-300/70 text-sm">{key}: </span>
                              <span className="text-blue-100 break-all font-mono text-xs">
                                {formatValue(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-blue-300/70 text-sm">No detailed logs available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
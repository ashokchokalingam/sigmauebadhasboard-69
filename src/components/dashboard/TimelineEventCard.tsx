import { useQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineDetailedLogs from "./TimelineDetailedLogs";

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
      
      if (!event.target_user_name) {
        console.error('No target_user_name provided for detailed logs query');
        return null;
      }

      const baseUrl = '/api/user_impacted_logs';
      const params = new URLSearchParams();
      params.append('user_impacted', event.target_user_name);
      params.append('title', event.title);
      params.append('page', '1');
      params.append('per_page', '500');

      console.log('Fetching logs with params:', baseUrl + '?' + params.toString());

      const response = await fetch(`${baseUrl}?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch logs:', errorData);
        throw new Error('Failed to fetch logs');
      }
      
      return response.json();
    },
    enabled: isExpanded && !!event.target_user_name
  });

  return (
    <div className="group relative pl-6">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2 border-green-400 bg-background" />
      {!isLast && (
        <div className="absolute left-0 top-8 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-green-400/50 to-transparent" />
      )}

      <div className="relative ml-6 mb-6 w-[75%]">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm cursor-pointer",
            isExpanded && "border-blue-500/30"
          )}
        >
          <TimelineEventHeader
            ruleLevel={event.rule_level}
            totalRecords={detailedLogs?.pagination?.total_records || 0}
            title={event.title}
            description={event.description}
          />

          <TimelineEventTimestamps
            firstTimeSeen={event.first_time_seen || ''}
            lastTimeSeen={event.last_time_seen || ''}
          />

          <TimelineMitreSection alert={event} />

          {isExpanded && (
            <TimelineDetailedLogs
              logs={detailedLogs?.user_impacted_logs || []}
              isLoading={isLoading}
              totalRecords={detailedLogs?.pagination?.total_records || 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
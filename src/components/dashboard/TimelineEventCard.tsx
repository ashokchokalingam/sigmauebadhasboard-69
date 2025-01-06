import { useQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import TimelineEventBarChart from "./TimelineEventBarChart";
import { User } from "lucide-react";

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

  const { data: detailedLogs, isLoading } = useQuery({
    queryKey: ['detailed-logs', event.user_impacted, event.title, isExpanded],
    queryFn: async () => {
      if (!isExpanded) return null;
      
      if (!event.user_impacted) {
        console.error('No user_impacted provided for detailed logs query');
        return null;
      }

      try {
        const baseUrl = '/api/user_impacted_logs';
        const params = new URLSearchParams();
        params.append('user_impacted', event.user_impacted);
        params.append('title', event.title);
        params.append('page', '1');
        params.append('per_page', '500');

        console.log('Fetching logs with params:', baseUrl + '?' + params.toString());

        const response = await fetch(`${baseUrl}?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching detailed logs:', error);
        return null;
      }
    },
    enabled: isExpanded && !!event.user_impacted
  });

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="group relative pl-6 w-full">
      <div className="absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2 border-green-400 bg-background" />
      {!isLast && (
        <div className="absolute left-0 top-8 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-green-400/50 to-transparent" />
      )}

      <div className="relative ml-6 mb-6 w-full">
        <div 
          onClick={handleCardClick}
          className={cn(
            "p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm cursor-pointer w-full",
            isExpanded && "border-blue-500/30"
          )}
        >
          <TimelineEventHeader
            ruleLevel={event.rule_level}
            totalRecords={event.total_events || 0}
            title={event.title}
            description={event.description}
          />

          <div className="flex items-center gap-2 mt-2 mb-3">
            <User className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              User Impacted: <span className="font-mono text-blue-400">{event.user_impacted}</span>
            </span>
          </div>

          <TimelineEventTimestamps
            firstTimeSeen={event.first_time_seen || ''}
            lastTimeSeen={event.last_time_seen || ''}
          />

          <TimelineMitreSection alert={event} />

          {isExpanded && (
            <>
              {detailedLogs?.user_impacted_logs && (
                <TimelineEventBarChart logs={detailedLogs.user_impacted_logs} />
              )}
              <TimelineDetailedLogs
                logs={detailedLogs?.user_impacted_logs || []}
                isLoading={isLoading}
                totalRecords={detailedLogs?.pagination?.total_records || 0}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
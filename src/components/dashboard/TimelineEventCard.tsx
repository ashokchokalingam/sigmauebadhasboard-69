import { useQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import { User, Monitor } from "lucide-react";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
}

interface DetailedLogResponse {
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_records: number;
  };
  user_impacted_logs?: Alert[];
  computer_impacted_logs?: Alert[];
  user_origin_logs?: Alert[];
}

const TimelineEventCard = ({ event, isLast, entityType }: TimelineEventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: detailedLogs, isLoading } = useQuery({
    queryKey: ['detailed-logs', entityType, event.computer_name || event.user_impacted || event.user_origin, event.title, isExpanded],
    queryFn: async () => {
      if (!isExpanded) return null;
      
      const identifier = entityType === "computersimpacted" ? event.computer_name : 
                        entityType === "userorigin" ? event.user_origin :
                        event.user_impacted;
      
      if (!identifier) {
        console.error('No identifier provided for detailed logs query');
        return null;
      }

      try {
        const baseUrl = entityType === "computersimpacted" ? '/api/computer_impacted_logs' :
                       entityType === "userorigin" ? '/api/user_origin_logs' :
                       '/api/user_impacted_logs';
        const params = new URLSearchParams();
        
        if (entityType === "computersimpacted") {
          params.append('computer_name', identifier);
        } else if (entityType === "userorigin") {
          params.append('user_origin', identifier);
        } else {
          params.append('user_impacted', identifier);
        }
        
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
    enabled: isExpanded && !!(event.computer_name || event.user_impacted || event.user_origin)
  });

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const mappedEntityType = 
    entityType === "userorigin" ? "user" :
    entityType === "userimpacted" ? "user" :
    "computer";

  return (
    <div className="group relative pl-4 w-full">
      <div className="absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2 border-green-400 bg-background" />
      {!isLast && (
        <div className="absolute left-0 top-8 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-green-400/50 to-transparent" />
      )}

      <div className="relative ml-4 mb-6 w-full">
        <div 
          onClick={handleCardClick}
          className={cn(
            "p-6 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm cursor-pointer w-full",
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
            {entityType === "computersimpacted" ? (
              <>
                <Monitor className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  Computer: <span className="font-mono text-blue-400">{event.computer_name}</span>
                </span>
              </>
            ) : entityType === "userorigin" ? (
              <>
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  User Origin: <span className="font-mono text-blue-400">{event.user_origin}</span>
                </span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  User Impacted: <span className="font-mono text-blue-400">{event.user_impacted}</span>
                </span>
              </>
            )}
          </div>

          <TimelineEventTimestamps
            firstTimeSeen={event.first_time_seen || ''}
            lastTimeSeen={event.last_time_seen || ''}
          />

          <TimelineMitreSection alert={event} />

          {isExpanded && (
            <TimelineDetailedLogs
              logs={entityType === "computersimpacted" ? detailedLogs?.computer_impacted_logs || [] :
                   entityType === "userorigin" ? detailedLogs?.user_origin_logs || [] :
                   detailedLogs?.user_impacted_logs || []}
              isLoading={isLoading}
              totalRecords={detailedLogs?.pagination?.total_records || 0}
              entityType={mappedEntityType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
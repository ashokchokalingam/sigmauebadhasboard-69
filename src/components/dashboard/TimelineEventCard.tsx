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
  entityType: "user" | "computer" | "origin";
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
    queryKey: ['detailed-logs', entityType, event.computer_name || event.user_impacted || event.user_id, event.title, isExpanded],
    queryFn: async () => {
      if (!isExpanded) return null;
      
      let identifier;
      let baseUrl;
      const params = new URLSearchParams();

      switch (entityType) {
        case "computer":
          identifier = event.computer_name;
          baseUrl = '/api/computer_impacted_logs';
          params.append('computer_name', identifier || '');
          break;
        case "user":
          identifier = event.user_impacted;
          baseUrl = '/api/user_impacted_logs';
          params.append('user_impacted', identifier || '');
          break;
        case "origin":
          identifier = event.user_id;
          baseUrl = '/api/user_origin_logs';
          params.append('user_origin', identifier || '');
          break;
        default:
          throw new Error('Invalid entity type');
      }

      if (!identifier) {
        console.error('No identifier provided for detailed logs query');
        return null;
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
    },
    enabled: isExpanded && !!(event.computer_name || event.user_impacted || event.user_id)
  });

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const getDetailedLogs = () => {
    if (!detailedLogs) return [];
    
    switch (entityType) {
      case "computer":
        return detailedLogs.computer_impacted_logs || [];
      case "user":
        return detailedLogs.user_impacted_logs || [];
      case "origin":
        return detailedLogs.user_origin_logs || [];
      default:
        return [];
    }
  };

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
            {entityType === "computer" ? (
              <>
                <Monitor className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  Computer: <span className="font-mono text-blue-400">{event.computer_name}</span>
                </span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  {entityType === "origin" ? "User Origin" : "User Impacted"}: <span className="font-mono text-blue-400">{entityType === "origin" ? event.user_id : event.user_impacted}</span>
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
              logs={getDetailedLogs()}
              isLoading={isLoading}
              totalRecords={detailedLogs?.pagination?.total_records || 0}
              entityType={entityType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
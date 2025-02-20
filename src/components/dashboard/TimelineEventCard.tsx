
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineInstanceList from "./TimelineInstanceList";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import { getRiskLevel } from "./utils";
import { useQuery } from "@tanstack/react-query";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect: (id: string | null) => void;
  detailedLogs?: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  instances?: Alert[];
  isLoadingLogs?: boolean;
  selectedEventId: string | null;
}

const TimelineEventCard = ({ 
  event, 
  isLast, 
  isLatest,
  entityType,
  onSelect,
  detailedLogs,
  isExpanded,
  onToggleExpand,
  instances = [],
  isLoadingLogs = false,
  selectedEventId
}: TimelineEventCardProps) => {
  const isSelected = selectedEventId === event.id;
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  // Generate a unique query key for this specific card
  const queryKey = `logs-${event.id}`;

  const { data: logsData, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const params = new URLSearchParams({
        user_origin: event.user_origin || '',
        title: event.title || ''
      });
      
      console.log(`Fetching logs for card ${event.id}:`, params.toString());
      
      const response = await fetch(`/api/user_origin_logs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      return response.json();
    },
    enabled: isSelected, // Only enable the query when this specific card is selected
    staleTime: Infinity, // Keep the data fresh indefinitely once fetched
    cacheTime: 1000 * 60 * 5 // Cache the data for 5 minutes
  });

  const handleCardClick = () => {
    console.log('Card clicked:', {
      id: event.id,
      user_origin: event.user_origin,
      title: event.title
    });
    onSelect(isSelected ? null : event.id);
  };

  const mappedEntityType = entityType === "computersimpacted" ? "computer" : "user";

  return (
    <div className="group relative pl-4 w-full">
      <div className={cn(
        "absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2",
        color,
        "bg-background"
      )} />
      {!isLast && (
        <div className={cn(
          "absolute left-0 top-8 -ml-[1px] h-full w-[2px]",
          "bg-gradient-to-b from-current to-transparent",
          color
        )} />
      )}

      <div className="relative ml-4 mb-2">
        <div 
          className={cn(
            "rounded-lg border shadow-lg transition-all duration-300",
            cardBg,
            border,
            hover,
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75",
            isSelected && "ring-2 ring-purple-500/50"
          )}
        >
          <div 
            onClick={handleCardClick}
            className="p-4 cursor-pointer hover:bg-slate-800/10 transition-colors"
          >
            <TimelineEventHeader
              ruleLevel={event.rule_level}
              totalRecords={event.total_events || 0}
              title={event.title}
              description={event.description}
            />

            <TimelineEventTimestamps
              firstSeen={event.first_time_seen || event.system_time}
              lastSeen={event.last_time_seen || event.system_time}
            />

            {event.tags && <TimelineMitreSection tags={event.tags} />}
          </div>

          <TimelineInstanceList
            instances={instances}
            isExpanded={isExpanded || false}
            onToggle={() => onToggleExpand?.()}
          />

          {isSelected && (
            <div className="border-t border-blue-500/10">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : logsData ? (
                <TimelineDetailedLogs
                  logs={logsData?.user_origin_logs || []}
                  isLoading={false}
                  totalRecords={logsData?.pagination?.total_records || 0}
                  entityType={mappedEntityType}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

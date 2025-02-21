
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "./utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineConnector from "./TimelineConnector";
import { toast } from "sonner";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect?: (id: string | null) => void;
  selectedEventId?: string | null;
}

const TimelineEventCard = ({ 
  event, 
  isLast, 
  isLatest,
  entityType,
  onSelect,
  selectedEventId,
}: TimelineEventCardProps) => {
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  const handleClick = async () => {
    console.log('Card clicked:', {
      entityType,
      eventId: event.id,
      title: event.title,
      user_origin: event.user_origin,
      user_impacted: event.user_impacted,
      computer_name: event.computer_name
    });

    let endpoint = '/api/user_origin_logs';
    const params = new URLSearchParams();

    if (entityType === "userorigin") {
      if (!event.user_origin || !event.title) {
        toast.error("Missing required parameters");
        return;
      }
      params.append("user_origin", event.user_origin);
      params.append("title", event.title);
    } else {
      endpoint = entityType === "computersimpacted" 
        ? '/api/computer_impacted_logs'
        : '/api/user_impacted_logs';

      const paramKey = entityType === "computersimpacted" 
        ? "computer_name" 
        : "user_impacted";
      
      const paramValue = entityType === "computersimpacted"
        ? event.computer_name
        : event.user_impacted;

      if (!paramValue) {
        toast.error("Missing required parameters");
        return;
      }

      params.append(paramKey, paramValue);
      params.append("title", event.title || '');
    }

    const url = `${endpoint}?${params.toString()}`;
    console.log('Fetching logs from:', url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('API Response:', data);
      if (onSelect) {
        onSelect(event.id === selectedEventId ? null : event.id);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error("Failed to fetch logs");
    }
  };

  return (
    <div className="group relative pl-4 w-full">
      <TimelineConnector color={color} isLast={isLast} />

      <div className="relative ml-4 mb-2">
        <div 
          className={cn(
            "rounded-lg border shadow-lg cursor-pointer",
            cardBg,
            border,
            hover,
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75"
          )}
          onClick={handleClick}
        >
          <div className="p-4">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex-1">
                <TimelineEventHeader
                  ruleLevel={event.rule_level}
                  totalRecords={event.total_events || 0}
                  title={event.title}
                  description={event.description}
                />
              </div>
            </div>

            <TimelineEventTimestamps
              firstSeen={event.first_time_seen || event.system_time}
              lastSeen={event.last_time_seen || event.system_time}
            />

            {event.tags && <TimelineMitreSection tags={event.tags} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

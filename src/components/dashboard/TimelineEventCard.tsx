
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "./utils";
import TimelineConnector from "./TimelineConnector";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import TimelineLogsTable from "./TimelineLogsTable";
import TimelineCardContent from "./TimelineCardContent";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect?: (id: string | null) => void;
  selectedEventId?: string | null;
  detailedLogs?: any;
  instances?: Alert[];
  isLoadingLogs?: boolean;
}

const TimelineEventCard = ({ 
  event, 
  isLast, 
  isLatest,
  entityType,
  onSelect,
  selectedEventId,
  detailedLogs,
  instances,
  isLoadingLogs
}: TimelineEventCardProps) => {
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);
  const [logs, setLogs] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<'mloutliers' | 'anomalies'>('anomalies');
  const [visibleColumns] = useState<string[]>(['system_time', 'title']);

  // Reset logs when card is collapsed
  useEffect(() => {
    if (selectedEventId !== event.id) {
      setLogs([]);
    }
  }, [selectedEventId, event.id]);

  const handleClick = async () => {
    console.log('Card clicked:', {
      entityType,
      eventId: event.id,
      title: event.title,
      currentSelection: selectedEventId,
      isCurrentlyExpanded: selectedEventId === event.id
    });

    if (onSelect) {
      onSelect(event.id);
    }

    // Only fetch logs if this card is being expanded
    if (selectedEventId !== event.id) {
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

      try {
        const response = await fetch(`${endpoint}?${params.toString()}`);
        const data = await response.json();
        console.log('API Response:', data);
        
        const logsArray = entityType === "userorigin" ? data.user_origin_logs : data;
        const processedLogs = Array.isArray(logsArray) ? logsArray : [];
        setLogs(processedLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast.error("Failed to fetch logs");
      }
    }
  };

  const isExpanded = selectedEventId === event.id;

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
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75",
            isExpanded && "ring-2 ring-blue-500"
          )}
        >
          <TimelineCardContent event={event} onClick={handleClick} />

          {isExpanded && (
            <TimelineLogsTable
              logs={logs}
              visibleColumns={visibleColumns}
              dataSource={dataSource}
              onDataSourceChange={setDataSource}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

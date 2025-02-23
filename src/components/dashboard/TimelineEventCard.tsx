
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
  isLoadingLogs
}: TimelineEventCardProps) => {
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);
  const [logs, setLogs] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<'mloutliers' | 'anomalies'>('anomalies');
  const [visibleColumns] = useState<string[]>(['system_time', 'title']);

  console.log('TimelineEventCard render:', {
    title: event.title,
    logs_length: logs.length,
    rule_level: event.rule_level
  });

  // Reset logs when card is collapsed
  useEffect(() => {
    if (selectedEventId !== event.id) {
      setLogs([]);
    }
  }, [selectedEventId, event.id]);

  const handleClick = async () => {
    if (onSelect) {
      onSelect(event.id);
    }

    // Only fetch logs if this card is being expanded
    if (selectedEventId !== event.id) {
      const config = {
        userorigin: {
          endpoint: '/api/user_origin_logs',
          paramKey: 'user_origin',
          paramValue: event.user_origin
        },
        userimpacted: {
          endpoint: '/api/user_impacted_logs',
          paramKey: 'user_impacted',
          paramValue: event.user_impacted
        },
        computersimpacted: {
          endpoint: '/api/computer_impacted_logs',
          paramKey: 'computer_name',
          paramValue: event.computer_name
        }
      };

      const { endpoint, paramKey, paramValue } = config[entityType];

      if (!paramValue || !event.title) {
        toast.error("Missing required parameters");
        return;
      }

      const params = new URLSearchParams({
        [paramKey]: paramValue,
        title: event.title
      });

      try {
        const response = await fetch(`${endpoint}?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const logsMap = {
          userorigin: data.user_origin_logs,
          userimpacted: data.user_impacted_logs,
          computersimpacted: data.computer_impacted_logs
        };
        
        const logsArray = logsMap[entityType] || [];
        setLogs(Array.isArray(logsArray) ? logsArray : []);
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast.error("Failed to fetch logs");
      }
    }
  };

  const isExpanded = selectedEventId === event.id;
  const totalEvents = logs.length || event.total_events || 0;

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
          <TimelineCardContent 
            event={{...event, total_events: totalEvents}}
            onClick={handleClick} 
          />

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


import { Alert } from "./types";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "./utils";
import TimelineConnector from "./TimelineConnector";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import TimelineLogsTable from "./TimelineLogsTable";
import TimelineCardContent from "./TimelineCardContent";
import LoadingSpinner from "@/components/timeline/components/LoadingSpinner";

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
  const [visibleColumns] = useState<string[]>(['system_time', 'title', 'description', 'ip_address', 'rule_level']);

  // Reset logs when card is collapsed
  useEffect(() => {
    if (selectedEventId !== event.id) {
      setLogs([]);
    } else if (detailedLogs) {
      setLogs(Array.isArray(detailedLogs) ? detailedLogs : []);
    }
  }, [selectedEventId, event.id, detailedLogs]);

  const handleClick = () => {
    console.log('Card clicked:', {
      entityType,
      eventId: event.id,
      title: event.title,
      currentSelection: selectedEventId,
      isCurrentlyExpanded: selectedEventId === event.id,
      computerName: event.computer_name,
      userOrigin: event.user_origin
    });

    if (onSelect) {
      // If it's already selected, deselect it
      if (selectedEventId === event.id) {
        onSelect(null);
      } else {
        onSelect(event.id);
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
            "rounded-lg border shadow-lg cursor-pointer transition-all duration-200",
            cardBg,
            border,
            hover,
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75",
            isExpanded && "ring-2 ring-blue-500"
          )}
        >
          <TimelineCardContent event={event} onClick={handleClick} />

          {isExpanded && (
            <div className="border-t border-slate-700/50">
              {isLoadingLogs ? (
                <div className="p-4 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : logs && logs.length > 0 ? (
                <div className="p-4">
                  <TimelineLogsTable
                    logs={logs}
                    visibleColumns={visibleColumns}
                    dataSource={dataSource}
                    onDataSourceChange={setDataSource}
                  />
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400">
                  No detailed logs available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

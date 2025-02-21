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
  const [dataSource, setDataSource] = useState<'mloutliers' | 'anomalies'>('anomalies');
  const [visibleColumns] = useState<string[]>(['system_time', 'title']);

  const handleClick = () => {
    console.log('Card clicked:', {
      entityType,
      eventId: event.id,
      currentSelection: selectedEventId
    });

    if (onSelect) {
      onSelect(selectedEventId === event.id ? null : event.id);
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

          {isExpanded && detailedLogs && (
            <TimelineLogsTable
              logs={detailedLogs.logs || []}
              visibleColumns={visibleColumns}
              dataSource={dataSource}
              onDataSourceChange={setDataSource}
            />
          )}

          {isExpanded && isLoadingLogs && (
            <div className="p-4 text-center text-[#9b87f5]/60">
              Loading logs...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

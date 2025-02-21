
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "./utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineConnector from "./TimelineConnector";
import { toast } from "sonner";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useState } from "react";
import AnomaliesTableHeaderSection from "./AnomaliesTableHeaderSection";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect?: (id: string | null) => void;
  selectedEventId?: string | null;
  detailedLogs?: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
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
  isExpanded,
  onToggleExpand,
  instances,
  isLoadingLogs
}: TimelineEventCardProps) => {
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);
  const [logs, setLogs] = useState<any[]>([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<'mloutliers' | 'anomalies'>('anomalies');

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
      
      const logsArray = entityType === "userorigin" ? data.user_origin_logs : data;
      const processedLogs = Array.isArray(logsArray) ? logsArray : [];
      setLogs(processedLogs);
      
      if (processedLogs.length > 0) {
        // Set visible columns based on the first log entry
        setVisibleColumns(Object.keys(processedLogs[0]));
      }
      
      setIsTableExpanded(true);
      
      if (onSelect) {
        onSelect(event.id === selectedEventId ? null : event.id);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error("Failed to fetch logs");
    }
  };

  const renderLogsTable = () => {
    if (!logs.length) return null;

    return (
      <div className="mt-4 bg-[#1A1F2C] rounded-lg overflow-hidden border border-purple-900/20">
        <AnomaliesTableHeaderSection
          visibleColumns={visibleColumns}
          onColumnToggle={setVisibleColumns}
          onSelectAll={() => setVisibleColumns(Object.keys(logs[0]))}
          onDeselectAll={() => setVisibleColumns([])}
          dataSource={dataSource}
          onDataSourceChange={setDataSource}
        />
        
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((key) => (
                  <TableHead 
                    key={key} 
                    className="whitespace-nowrap px-4 py-2 bg-[#1A1F2C] text-[#9b87f5] border-b border-purple-900/20"
                  >
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow 
                  key={index}
                  className="border-b border-purple-900/10 hover:bg-purple-900/5"
                >
                  {visibleColumns.map((key) => (
                    <TableCell 
                      key={key} 
                      className="whitespace-nowrap px-4 py-2 text-blue-300/70"
                    >
                      {typeof log[key] === 'object' 
                        ? JSON.stringify(log[key]) 
                        : String(log[key] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
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
        >
          <div className="p-4" onClick={handleClick}>
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

          {isTableExpanded && renderLogsTable()}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

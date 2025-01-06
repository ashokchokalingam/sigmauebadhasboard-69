import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading: boolean;
  totalRecords: number;
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords }: TimelineDetailedLogsProps) => {
  const [expandedLogs, setExpandedLogs] = useState<string[]>([]);

  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!logs?.length) {
    return <p className="text-blue-300/70 text-sm">No detailed logs available</p>;
  }

  // Sort logs by system_time in descending order (most recent first)
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.system_time).getTime() - new Date(a.system_time).getTime()
  );

  return (
    <div className="mt-4 border-t border-blue-500/10 pt-4">
      <h4 className="text-blue-100 font-medium mb-3">Detailed Timeline ({totalRecords} events)</h4>
      <ScrollArea className="h-[500px] w-full rounded-md border border-blue-500/10">
        <div className="divide-y divide-blue-500/10">
          {sortedLogs.map((log, index) => (
            <div 
              key={log.id || index}
              className="hover:bg-blue-500/5 transition-colors"
            >
              {/* Single row view */}
              <div 
                className="flex items-center px-4 py-2 cursor-pointer"
                onClick={() => toggleExpand(log.id)}
              >
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 text-blue-400 transition-transform duration-200 mr-2",
                    expandedLogs.includes(log.id) && "transform rotate-90"
                  )}
                />
                
                {/* Timestamp */}
                <div className="flex items-center gap-2 w-48 min-w-48 text-sm text-blue-300">
                  <Clock className="h-4 w-4" />
                  {formatDate(log.system_time)}
                </div>

                {/* Event ID */}
                <div className="w-24 min-w-24 text-sm font-mono text-blue-200">
                  {log.event_id}
                </div>

                {/* Provider */}
                <div className="w-64 min-w-64 text-sm font-mono text-blue-200 truncate">
                  {log.provider_name}
                </div>

                {/* Message Preview */}
                <div className="flex-1 text-sm text-blue-300/90 truncate">
                  {log.message || 'No message available'}
                </div>
              </div>

              {/* Expanded details */}
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-200 bg-blue-950/20",
                  expandedLogs.includes(log.id) ? "max-h-[500px] py-4" : "max-h-0"
                )}
              >
                <div className="px-4 space-y-2">
                  {Object.entries(log).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[200px,1fr] gap-4">
                      <span className="text-blue-300/70 text-sm font-medium">{key}:</span>
                      <span className="text-blue-100 break-all font-mono text-sm">
                        {formatValue(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineDetailedLogs;
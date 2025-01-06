import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock } from "lucide-react";
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
      <ScrollArea className="h-[500px] w-full rounded-md border border-blue-500/10 p-4">
        <div className="space-y-4">
          {sortedLogs.map((log, index) => (
            <div 
              key={log.id || index}
              className="relative pl-4 border-l border-blue-500/20"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 -ml-[5px] h-2.5 w-2.5 rounded-full bg-blue-500" />
              
              <div className="mb-4">
                {/* Timestamp */}
                <div className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                  <Clock className="h-4 w-4" />
                  {formatDate(log.system_time)}
                </div>

                {/* Main content */}
                <div className="bg-black/20 rounded-lg border border-blue-500/10">
                  {/* Essential info always visible */}
                  <div className="p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-blue-300/70 text-sm">Event ID: </span>
                        <span className="text-blue-100 font-mono text-sm">{log.event_id}</span>
                      </div>
                      <div>
                        <span className="text-blue-300/70 text-sm">Provider: </span>
                        <span className="text-blue-100 font-mono text-sm">{log.provider_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable section */}
                  <button
                    onClick={() => toggleExpand(log.id)}
                    className="w-full flex items-center gap-2 p-2 text-sm text-blue-300/70 hover:text-blue-300 border-t border-blue-500/10"
                  >
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedLogs.includes(log.id) && "transform rotate-90"
                      )} 
                    />
                    View Details
                  </button>

                  {/* Expanded content */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-200",
                    expandedLogs.includes(log.id) ? "max-h-[500px]" : "max-h-0"
                  )}>
                    <div className="p-3 border-t border-blue-500/10 bg-black/40">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(log).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <span className="text-blue-300/70 text-sm">{key}: </span>
                            <span className="text-blue-100 break-all font-mono text-xs">
                              {formatValue(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { format, parseISO } from "date-fns";
import { ChevronRight, Clock, Terminal, Shield, MonitorDot, AlertCircle, User, Network } from "lucide-react";
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
        <div className="space-y-4 p-4">
          {sortedLogs.map((log, index) => (
            <div 
              key={log.id || index}
              className="relative pl-4"
            >
              {/* Timeline dot and line */}
              <div className="absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2 border-green-400 bg-background" />
              {index !== sortedLogs.length - 1 && (
                <div className="absolute left-0 top-8 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-green-400/50 to-transparent" />
              )}

              {/* Card content */}
              <div className="ml-4">
                <div className="p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300">
                  {/* Header with timestamp and event ID */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-blue-300">
                        {formatDate(log.system_time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-mono text-blue-300">
                        Event ID: {log.event_id}
                      </span>
                    </div>
                  </div>

                  {/* Main info grid */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <MonitorDot className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-blue-300">Computer: </span>
                      <span className="text-sm text-blue-100">{log.computer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-blue-300">Provider: </span>
                      <span className="text-sm text-blue-100">{log.provider_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-blue-300">Target User: </span>
                      <span className="text-sm text-blue-100">{log.target_user_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-blue-300">IP Address: </span>
                      <span className="text-sm text-blue-100">{log.ip_address}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <span className="text-sm text-blue-300">Description:</span>
                    <p className="text-sm text-blue-100 mt-1">{log.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {log.tags.split(",").map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Raw data section */}
                  <div>
                    <button
                      onClick={() => toggleExpand(log.id)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ChevronRight 
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          expandedLogs.includes(log.id) && "transform rotate-90"
                        )}
                      />
                      <Terminal className="h-4 w-4" />
                      <span className="text-sm">Raw Data</span>
                    </button>

                    {expandedLogs.includes(log.id) && (
                      <div className="mt-2 overflow-x-auto">
                        <pre className="p-4 bg-black/60 rounded-lg border border-blue-500/10 text-xs text-blue-100 font-mono whitespace-pre-wrap">
                          {typeof log.raw === 'string' ? log.raw : JSON.stringify(log.raw, null, 2)}
                        </pre>
                      </div>
                    )}
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
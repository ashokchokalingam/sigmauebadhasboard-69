import { useState } from "react";
import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { Shield, Clock, User, Monitor, AlertTriangle, Server, Network } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DetailsPanel from "./TimelineDetailedLogs/DetailsPanel";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
  entityType?: "user" | "computer";
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords, entityType = "user" }: TimelineDetailedLogsProps) => {
  const [selectedLog, setSelectedLog] = useState<Alert | null>(null);

  if (isLoading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-400">
        No logs available
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy HH:mm:ss");
    } catch {
      return "Invalid Date";
    }
  };

  const getRiskColor = (risk: number | null) => {
    if (risk === null) return "text-gray-400 bg-gray-500/10";
    if (risk >= 80) return "text-red-400 bg-red-500/10";
    if (risk >= 60) return "text-orange-400 bg-orange-500/10";
    if (risk >= 40) return "text-yellow-400 bg-yellow-500/10";
    return "text-green-400 bg-green-500/10";
  };

  return (
    <div className="flex">
      <ScrollArea className="h-[800px] flex-1">
        <div className="space-y-1 p-4">
          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className={cn(
                "group flex items-center gap-4 p-3 rounded-lg cursor-pointer",
                "hover:bg-blue-500/5 border border-transparent",
                "hover:border-blue-500/20 transition-all duration-200",
                selectedLog?.id === log.id ? "bg-blue-500/10 border-blue-500/30" : ""
              )}
            >
              {/* Risk Score */}
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-medium min-w-[80px] text-center",
                getRiskColor(log.risk)
              )}>
                {log.risk === null ? 'N/A' : `${log.risk}%`}
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 min-w-[200px]">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-200 font-mono">
                  {formatDateTime(log.system_time)}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-100">{log.title}</h4>
                <p className="text-xs text-blue-300/70 line-clamp-1">{log.description}</p>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 min-w-[150px]">
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-200 font-mono">{log.user_id || 'N/A'}</span>
              </div>

              {/* Computer Info */}
              <div className="flex items-center gap-2 min-w-[150px]">
                <Monitor className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-200 font-mono">{log.computer_name || 'N/A'}</span>
              </div>

              {/* MITRE Tags */}
              <div className="flex gap-1 min-w-[200px] overflow-x-auto">
                {log.tags.split(',').slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full whitespace-nowrap"
                  >
                    {tag.trim()}
                  </span>
                ))}
                {log.tags.split(',').length > 2 && (
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full whitespace-nowrap">
                    +{log.tags.split(',').length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Details Panel */}
      {selectedLog && (
        <div className="w-1/3 border-l border-purple-500/20">
          <DetailsPanel 
            alert={selectedLog} 
            onClose={() => setSelectedLog(null)} 
            formatTime={formatDateTime}
          />
        </div>
      )}
    </div>
  );
};

export default TimelineDetailedLogs;
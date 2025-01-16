import { useState } from "react";
import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { Shield, Clock, User, Monitor, AlertTriangle, Server, Network } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
    if (risk === null) return "bg-gray-500/20 text-gray-300";
    if (risk >= 80) return "bg-red-500/20 text-red-300";
    if (risk >= 60) return "bg-orange-500/20 text-orange-300";
    if (risk >= 40) return "bg-yellow-500/20 text-yellow-300";
    return "bg-green-500/20 text-green-300";
  };

  return (
    <ScrollArea className="h-[800px]">
      <div className="space-y-4 p-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-100 font-mono">
                      {log.title}
                    </h3>
                  </div>
                  <p className="text-sm text-blue-300/70 max-w-2xl">
                    {log.description}
                  </p>
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium",
                  getRiskColor(log.risk)
                )}>
                  Risk Score: {log.risk ?? 'N/A'}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Timestamp</span>
                  </div>
                  <p className="text-sm text-blue-100 font-mono">
                    {formatDateTime(log.system_time)}
                  </p>
                </div>

                <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">User Origin</span>
                  </div>
                  <p className="text-sm text-blue-100 font-mono">
                    {log.user_id || 'N/A'}
                  </p>
                </div>

                <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <Monitor className="h-4 w-4" />
                    <span className="text-sm font-medium">Computer</span>
                  </div>
                  <p className="text-sm text-blue-100 font-mono">
                    {log.computer_name || 'N/A'}
                  </p>
                </div>

                <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Event ID</span>
                  </div>
                  <p className="text-sm text-blue-100 font-mono">
                    {log.event_id || 'N/A'}
                  </p>
                </div>

                <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <Server className="h-4 w-4" />
                    <span className="text-sm font-medium">Provider</span>
                  </div>
                  <p className="text-sm text-blue-100 font-mono">
                    {log.provider_name || 'N/A'}
                  </p>
                </div>

                <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <Network className="h-4 w-4" />
                    <span className="text-sm font-medium">IP Address</span>
                  </div>
                  <p className="text-sm text-blue-100 font-mono">
                    {log.ip_address || 'N/A'}
                  </p>
                </div>
              </div>

              {/* MITRE ATT&CK Section */}
              {log.tags && (
                <div className="space-y-4">
                  <div className="bg-purple-950/30 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="text-sm font-medium text-purple-200 mb-3">MITRE ATT&CK</h4>
                    <div className="flex flex-wrap gap-2">
                      {log.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20 font-mono"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ML Description */}
              {log.ml_description && (
                <div className="bg-indigo-950/30 rounded-lg p-4 border border-indigo-500/20">
                  <h4 className="text-sm font-medium text-indigo-200 mb-2">ML Analysis</h4>
                  <p className="text-sm text-indigo-100/90 font-mono">
                    {log.ml_description}
                  </p>
                </div>
              )}

              {/* Raw Log Data */}
              <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700/30">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Raw Log Data</h4>
                <pre className="text-xs text-slate-300/90 bg-black/30 p-4 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
                  {typeof log.raw === 'string' 
                    ? JSON.stringify(JSON.parse(log.raw), null, 2)
                    : JSON.stringify(log.raw, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TimelineDetailedLogs;
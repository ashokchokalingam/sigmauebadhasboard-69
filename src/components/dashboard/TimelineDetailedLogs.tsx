import { useState, useRef } from "react";
import { Alert } from "./types";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";
import { ChevronRight, AlertCircle, Info, Shield, Globe, Hash, Database, Terminal, Server, User, Clock, File, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
  entityType?: "user" | "computer";
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords, entityType = "user" }: TimelineDetailedLogsProps) => {
  const [selectedLog, setSelectedLog] = useState<Alert | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const detailsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (logId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const getSeverityIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const parseRawData = (rawData: string | null) => {
    if (!rawData) return null;
    try {
      return JSON.parse(rawData);
    } catch (e) {
      return null;
    }
  };

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

  return (
    <div className="mt-4">
      <div className="rounded-lg border border-purple-400/20 bg-[#1A1F2C]">
        <div className="sticky top-0 z-20 p-4 flex justify-between items-center text-sm text-purple-200/80 border-b border-purple-400/20 bg-purple-400/5 backdrop-blur-sm">
          <div>
            <span className="font-semibold">Total Records:</span> {totalRecords?.toLocaleString()}
          </div>
        </div>
        <ScrollArea className="h-[800px]">
          <div className="space-y-1 p-2">
            {logs.map((log, index) => {
              const rawData = parseRawData(log.raw);
              return (
                <div key={log.id}>
                  <div
                    className={cn(
                      "group flex items-start space-x-2 px-3 py-2 cursor-pointer rounded transition-colors",
                      "hover:bg-purple-400/10",
                      index % 2 === 0 ? "bg-purple-400/5" : "bg-transparent",
                      "font-mono text-sm"
                    )}
                  >
                    <button
                      onClick={(e) => toggleExpand(log.id.toString(), e)}
                      className="flex items-center space-x-2 min-w-[140px] text-purple-300/60"
                    >
                      <ChevronRight 
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedLogs.has(log.id.toString()) ? "rotate-90" : ""
                        )}
                      />
                      <span>
                        {format(new Date(log.system_time), "HH:mm:ss.SSS")}
                      </span>
                    </button>
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="flex items-center space-x-2">
                        {getSeverityIcon(log.rule_level)}
                        <span className="text-purple-100">
                          {log.title}
                        </span>
                      </span>
                    </div>
                  </div>
                  
                  {expandedLogs.has(log.id.toString()) && (
                    <div className="ml-8 mt-2 mb-4 space-y-4 text-sm text-purple-200/70 bg-purple-400/5 p-4 rounded-md">
                      {/* Basic Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-200">System Time:</span>
                            <span className="font-mono">{format(new Date(log.system_time), "PPpp")}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-200">Rule Level:</span>
                            <span className="font-mono">{log.rule_level}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-200">Event ID:</span>
                            <span className="font-mono">{log.event_id}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Server className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-200">Computer:</span>
                            <span className="font-mono">{log.computer_name}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-200">User:</span>
                            <span className="font-mono">{log.user_id || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-200">Domain:</span>
                            <span className="font-mono">{log.target_domain_name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Terminal className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-200">Task:</span>
                            <span className="font-mono">{log.task}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Database className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-200">ML Cluster:</span>
                            <span className="font-mono">{log.ml_cluster ?? 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description and ML Description */}
                      <div className="space-y-2">
                        <div>
                          <span className="text-purple-200 font-medium">Description:</span>
                          <p className="mt-1 text-purple-200/70">{log.description}</p>
                        </div>
                        {log.ml_description && (
                          <div>
                            <span className="text-purple-200 font-medium">ML Description:</span>
                            <p className="mt-1 text-purple-200/70">{log.ml_description}</p>
                          </div>
                        )}
                      </div>

                      {/* MITRE ATT&CK Information */}
                      <div className="space-y-2">
                        <span className="text-purple-200 font-medium">MITRE ATT&CK:</span>
                        <div className="flex flex-wrap gap-2">
                          {log.tags?.split(',').map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Raw Data Section */}
                      {rawData && (
                        <div className="space-y-2">
                          <span className="text-purple-200 font-medium">Additional Details:</span>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            {Object.entries(rawData).map(([key, value]) => (
                              <div key={key} className="flex items-start space-x-2">
                                <span className="text-purple-300 min-w-[150px]">{key}:</span>
                                <span className="text-purple-200/70 break-all">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TimelineDetailedLogs;
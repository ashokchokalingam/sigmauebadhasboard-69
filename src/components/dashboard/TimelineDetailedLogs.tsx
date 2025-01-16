import { useState, useRef } from "react";
import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";
import { ChevronRight, AlertCircle, Shield, Terminal, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
  entityType?: "user" | "computer";
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords }: TimelineDetailedLogsProps) => {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [selectedLog, setSelectedLog] = useState<Alert | null>(null);

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

  const getSeverityColor = (level: string = '') => {
    const l = level.toLowerCase();
    if (l.includes('critical')) return 'text-red-400';
    if (l.includes('high')) return 'text-orange-400';
    if (l.includes('medium')) return 'text-yellow-400';
    if (l.includes('low')) return 'text-green-400';
    return 'text-blue-400';
  };

  const parseRawData = (rawData: string | object | null): Record<string, any> | null => {
    if (!rawData) return null;
    try {
      if (typeof rawData === 'string') {
        return JSON.parse(rawData);
      }
      return rawData as Record<string, any>;
    } catch (e) {
      console.error('Error parsing raw data:', e);
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

  return (
    <div className="mt-4">
      <Card className="border border-purple-500/20 bg-[#1A1F2C] overflow-hidden">
        <div className="sticky top-0 z-20 p-4 flex justify-between items-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-semibold text-purple-100">
              Total Records: {totalRecords?.toLocaleString()}
            </span>
          </div>
        </div>

        <ScrollArea className="h-[800px]">
          <div className="space-y-1 p-2">
            {logs.map((log) => {
              const rawData = parseRawData(log.raw);
              return (
                <div key={log.id} className="group">
                  <div className={cn(
                    "flex items-start space-x-2 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-purple-500/10",
                    "border border-transparent hover:border-purple-500/20"
                  )}>
                    <button
                      onClick={(e) => toggleExpand(log.id.toString(), e)}
                      className="flex items-center space-x-2 min-w-[140px] text-purple-300"
                    >
                      <ChevronRight 
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          expandedLogs.has(log.id.toString()) ? "rotate-90" : ""
                        )}
                      />
                      <span className="font-mono">
                        {format(new Date(log.system_time), "HH:mm:ss")}
                      </span>
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className={cn("h-4 w-4", getSeverityColor(log.rule_level))} />
                        <span className="text-purple-100 font-medium">{log.title}</span>
                      </div>
                      <div className="text-sm text-purple-300/70">{log.description}</div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getSeverityColor(log.rule_level),
                        "bg-purple-500/10"
                      )}>
                        {log.rule_level}
                      </div>
                      <Server className="h-4 w-4 text-purple-400" />
                    </div>
                  </div>

                  {expandedLogs.has(log.id.toString()) && rawData && (
                    <div className="ml-12 mt-2 mb-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                      <div className="grid grid-cols-2 gap-4 p-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-purple-400">Event Details</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-purple-300">Event ID:</div>
                              <div className="text-purple-100 font-mono">{rawData.EventID}</div>
                              <div className="text-purple-300">Provider:</div>
                              <div className="text-purple-100 font-mono">{rawData.Provider_Name}</div>
                              <div className="text-purple-300">Task:</div>
                              <div className="text-purple-100 font-mono">{rawData.Task}</div>
                              <div className="text-purple-300">Level:</div>
                              <div className="text-purple-100 font-mono">{rawData.Level}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-purple-400">System Information</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-purple-300">Computer:</div>
                              <div className="text-purple-100 font-mono">{rawData.Computer}</div>
                              <div className="text-purple-300">Process ID:</div>
                              <div className="text-purple-100 font-mono">{rawData.ProcessID}</div>
                              <div className="text-purple-300">Thread ID:</div>
                              <div className="text-purple-100 font-mono">{rawData.ThreadID}</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-purple-400">User Information</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-purple-300">Subject User:</div>
                              <div className="text-purple-100 font-mono">{rawData.SubjectUserName}</div>
                              <div className="text-purple-300">Domain:</div>
                              <div className="text-purple-100 font-mono">{rawData.SubjectDomainName}</div>
                              <div className="text-purple-300">Logon ID:</div>
                              <div className="text-purple-100 font-mono">{rawData.SubjectLogonId}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-purple-400">Additional Details</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-purple-300">Channel:</div>
                              <div className="text-purple-100 font-mono">{rawData.Channel}</div>
                              <div className="text-purple-300">Keywords:</div>
                              <div className="text-purple-100 font-mono">{rawData.Keywords}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {log.tags && (
                        <div className="border-t border-purple-500/20 p-4">
                          <h3 className="text-sm font-medium text-purple-400 mb-2">MITRE ATT&CK</h3>
                          <div className="flex flex-wrap gap-2">
                            {log.tags.split(',').map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                              >
                                {tag.trim()}
                              </span>
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
      </Card>
    </div>
  );
};

export default TimelineDetailedLogs;
import { useState } from "react";
import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";
import { ChevronRight, AlertCircle, Shield, Terminal, Server, Clock, User, Hash, Network, Database, FileCode, Target, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { motion, AnimatePresence } from "framer-motion";

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
    if (l.includes('critical')) return 'text-red-400 bg-red-950/30';
    if (l.includes('high')) return 'text-orange-400 bg-orange-950/30';
    if (l.includes('medium')) return 'text-yellow-400 bg-yellow-950/30';
    if (l.includes('low')) return 'text-green-400 bg-green-950/30';
    return 'text-blue-400 bg-blue-950/30';
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
        <div className="sticky top-0 z-20 p-4 flex justify-between items-center bg-gradient-to-r from-purple-900/50 via-blue-900/30 to-indigo-900/50 backdrop-blur-sm border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-semibold text-purple-100">
              Security Events Log ({totalRecords?.toLocaleString()})
            </span>
          </div>
        </div>

        <ScrollArea className="h-[800px]">
          <div className="space-y-1 p-2">
            {logs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
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
                    <Clock className="h-4 w-4" />
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
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getSeverityColor(log.rule_level)
                    )}>
                      {log.rule_level}
                    </span>
                    <Server className="h-4 w-4 text-purple-400" />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedLogs.has(log.id.toString()) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-12 mt-2 mb-4"
                    >
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5 rounded-lg border border-purple-500/20">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
                              <User className="h-4 w-4" /> User Information
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-purple-300">User ID:</div>
                              <div className="text-purple-100 font-mono">{log.user_id || 'N/A'}</div>
                              <div className="text-purple-300">Target User:</div>
                              <div className="text-purple-100 font-mono">{log.target_user_name || 'N/A'}</div>
                              <div className="text-purple-300">Target Domain:</div>
                              <div className="text-purple-100 font-mono">{log.target_domain_name || 'N/A'}</div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
                              <Shield className="h-4 w-4" /> Security Details
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-purple-300">Event ID:</div>
                              <div className="text-purple-100 font-mono">{log.event_id || 'N/A'}</div>
                              <div className="text-purple-300">Risk Score:</div>
                              <div className={cn("font-mono", getSeverityColor(log.rule_level))}>
                                {log.risk || 'N/A'}
                              </div>
                              <div className="text-purple-300">Rule ID:</div>
                              <div className="text-purple-100 font-mono">{log.ruleid || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
                              <Network className="h-4 w-4" /> System Information
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-purple-300">Computer:</div>
                              <div className="text-purple-100 font-mono">{log.computer_name || 'N/A'}</div>
                              <div className="text-purple-300">IP Address:</div>
                              <div className="text-purple-100 font-mono">{log.ip_address || 'N/A'}</div>
                              <div className="text-purple-300">Provider:</div>
                              <div className="text-purple-100 font-mono">{log.provider_name || 'N/A'}</div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" /> MITRE ATT&CK
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {log.tactics?.split(',').map((tactic, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                                >
                                  {tactic.trim()}
                                </span>
                              ))}
                              {log.techniques?.split(',').map((technique, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
                                >
                                  {technique.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
                            <FileCode className="h-4 w-4" /> Raw Event Data
                          </h3>
                          <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs font-mono text-purple-100/90 whitespace-pre-wrap">
                              {JSON.stringify(parseRawData(log.raw), null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default TimelineDetailedLogs;
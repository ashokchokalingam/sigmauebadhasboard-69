import { Alert } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractTacticsAndTechniques } from "./utils";
import { Clock, Monitor, User, Shield, AlertTriangle, X, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TimelineViewProps {
  alerts: Alert[];
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
}

const TimelineView = ({ alerts, entityType, entityId, onClose }: TimelineViewProps) => {
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timelineRef.current && !timelineRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Filter and sort alerts for the specific entity
  const filteredAlerts = alerts
    .filter(alert => 
      entityType === "user" 
        ? alert.user_id === entityId
        : alert.computer_name === entityId
    )
    .sort((a, b) => new Date(b.system_time).getTime() - new Date(a.system_time).getTime());

  const toggleRawLog = (alertId: number) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  return (
    <div className="flex gap-4" ref={timelineRef}>
      <Card className="bg-black/40 border-blue-500/10 w-[800px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-blue-100 flex items-center gap-2">
            {entityType === "user" ? (
              <User className="h-5 w-5 text-blue-500" />
            ) : (
              <Monitor className="h-5 w-5 text-blue-500" />
            )}
            {entityId} Timeline
          </CardTitle>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-blue-400" />
          </button>
        </CardHeader>
        <CardContent className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-blue-500/20" />
          
          <div className="space-y-8">
            {filteredAlerts.map((alert, index) => {
              const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
              const time = new Date(alert.system_time);
              const isFirst = index === 0;
              const isExpanded = expandedAlert === alert.id;
              
              return (
                <div 
                  key={alert.id} 
                  className="relative pl-16"
                >
                  {/* Time indicator */}
                  <div className="absolute left-0 -translate-x-[calc(50%-1px)] flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${isFirst ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} shadow-lg shadow-blue-500/20`} />
                    <time className="mt-2 text-sm text-blue-400 font-mono whitespace-nowrap">
                      {time.toLocaleTimeString()}
                    </time>
                  </div>

                  {/* Event card */}
                  <div className="space-y-4">
                    <div className={`bg-blue-950/30 rounded-lg p-4 border transition-all
                      ${isExpanded 
                        ? 'border-blue-400 bg-blue-950/40' 
                        : 'border-blue-500/10'}`}
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-blue-400">Computer</p>
                          <p className="text-base text-blue-100 font-mono flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            {alert.computer_name}
                          </p>
                        </div>
                        {alert.ip_address && (
                          <div>
                            <p className="text-sm font-medium text-blue-400">IP Address</p>
                            <p className="text-base text-blue-100 font-mono">{alert.ip_address}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-blue-100">{alert.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                              {alert.ruleid}
                            </span>
                            {alert.dbscan_cluster === -1 && (
                              <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Outlier
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-400">Tactics</p>
                            <p className="text-base">
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                                {tactics || 'N/A'}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-400">Techniques</p>
                            <p className="text-base">
                              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
                                {techniques || 'N/A'}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-400">Provider</p>
                            <p className="text-base text-blue-100">{alert.provider_name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-400">Event ID</p>
                            <p className="text-base text-blue-100 font-mono">{alert.event_id}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-blue-400">Task</p>
                          <p className="text-base text-blue-100">{alert.task || 'N/A'}</p>
                        </div>

                        <button
                          onClick={() => toggleRawLog(alert.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                        >
                          <Terminal className="h-4 w-4" />
                          Raw Log
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Raw Log Section */}
                    {isExpanded && (
                      <div className="bg-black/60 rounded-lg border border-blue-500/10 transition-all">
                        <pre className="p-4 overflow-x-auto">
                          <code className="text-sm font-mono text-blue-100">
                            {JSON.stringify(JSON.parse(alert.raw), null, 2)}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineView;
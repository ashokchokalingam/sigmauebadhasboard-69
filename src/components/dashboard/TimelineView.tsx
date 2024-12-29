import { Alert } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, User, X, Activity, Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import TimelineEventCard from "./TimelineEventCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelineViewProps {
  alerts: Alert[];
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
}

interface AggregatedMetrics {
  firstSeen: Date;
  lastSeen: Date;
  totalEvents: number;
  eventsByDay: { date: string; count: number }[];
  eventTypes: { [key: string]: number };
}

const TimelineView = ({ alerts, entityType, entityId, onClose }: TimelineViewProps) => {
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Filter and sort alerts for the specific entity
  const filteredAlerts = alerts
    .filter(alert => 
      entityType === "user" 
        ? alert.user_id === entityId
        : alert.computer_name === entityId
    )
    .sort((a, b) => new Date(b.system_time).getTime() - new Date(a.system_time).getTime());

  // Calculate aggregated metrics
  const metrics: AggregatedMetrics = useMemo(() => {
    const eventDates = filteredAlerts.map(alert => new Date(alert.system_time));
    const eventTypes: { [key: string]: number } = {};
    
    // Count event types
    filteredAlerts.forEach(alert => {
      const type = alert.title.split(':')[0];
      eventTypes[type] = (eventTypes[type] || 0) + 1;
    });

    // Group events by day
    const eventsByDay = filteredAlerts.reduce((acc: { date: string; count: number }[], alert) => {
      const date = new Date(alert.system_time).toLocaleDateString();
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, []);

    // Convert dates to timestamps for Math.min/max
    const timestamps = eventDates.map(date => date.getTime());

    return {
      firstSeen: new Date(Math.min(...timestamps)),
      lastSeen: new Date(Math.max(...timestamps)),
      totalEvents: filteredAlerts.length,
      eventsByDay,
      eventTypes,
    };
  }, [filteredAlerts]);

  const toggleRawLog = (alertId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timelineRef.current && !timelineRef.current.contains(event.target as Node)) {
        const clickX = event.clientX;
        const clickY = event.clientY;
        const html = document.documentElement;
        const vScrollbar = html.scrollHeight > html.clientHeight;
        const hScrollbar = html.scrollWidth > html.clientWidth;
        const scrollbarWidth = window.innerWidth - html.clientWidth;
        const scrollbarHeight = window.innerHeight - html.clientHeight;
        const isVerticalScrollbarClick = vScrollbar && clickX >= window.innerWidth - scrollbarWidth;
        const isHorizontalScrollbarClick = hScrollbar && clickY >= window.innerHeight - scrollbarHeight;
        if (!isVerticalScrollbarClick && !isHorizontalScrollbarClick) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={timelineRef} className="flex gap-4">
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
        <CardContent>
          {/* Analytics Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-medium text-blue-300">First Seen</h3>
              </div>
              <p className="text-base text-blue-100 font-mono">
                {metrics.firstSeen.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-medium text-blue-300">Last Seen</h3>
              </div>
              <p className="text-base text-blue-100 font-mono">
                {metrics.lastSeen.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-medium text-blue-300">Total Events</h3>
              </div>
              <p className="text-base text-blue-100 font-mono">
                {metrics.totalEvents}
              </p>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/20 mb-6">
            <h3 className="text-base font-medium text-blue-300 mb-4">Activity Over Time</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.eventsByDay}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#60A5FA"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#60A5FA"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1f2c',
                      border: '1px solid rgba(96, 165, 250, 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Event Types */}
          <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/20 mb-6">
            <h3 className="text-base font-medium text-blue-300 mb-4">Event Types</h3>
            <div className="grid gap-2">
              {Object.entries(metrics.eventTypes).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center p-2 bg-blue-900/20 rounded">
                  <span className="text-blue-200">{type}</span>
                  <span className="text-blue-400 font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Events */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-blue-500/20" />
            <div className="space-y-8">
              {filteredAlerts.map((alert, index) => (
                <TimelineEventCard
                  key={alert.id}
                  alert={alert}
                  isExpanded={expandedAlert === alert.id}
                  onToggleRaw={toggleRawLog}
                  isFirst={index === 0}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineView;
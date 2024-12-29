import { Activity } from "lucide-react";
import { Alert } from "./types";
import { Card } from "@/components/ui/card";

interface TimelineEventTypesProps {
  alerts: Alert[];
}

interface EventMetric {
  type: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  intensity: number;
}

const TimelineEventTypes = ({ alerts }: TimelineEventTypesProps) => {
  // Calculate metrics for each event type
  const eventMetrics = alerts.reduce((acc: { [key: string]: EventMetric }, alert) => {
    const eventTypes = alert.tags.split(',').map(tag => tag.trim());
    
    eventTypes.forEach(type => {
      if (!type) return;
      
      const currentDate = new Date(alert.system_time);
      
      if (!acc[type]) {
        acc[type] = {
          type,
          count: 0,
          firstSeen: currentDate,
          lastSeen: currentDate,
          intensity: 0
        };
      }
      
      acc[type].count++;
      acc[type].firstSeen = new Date(Math.min(acc[type].firstSeen.getTime(), currentDate.getTime()));
      acc[type].lastSeen = new Date(Math.max(acc[type].lastSeen.getTime(), currentDate.getTime()));
    });
    
    return acc;
  }, {});

  // Convert to array and sort by count
  const sortedMetrics = Object.values(eventMetrics)
    .sort((a, b) => b.count - a.count)
    .map(metric => ({
      ...metric,
      intensity: (metric.count / Math.max(...Object.values(eventMetrics).map(m => m.count))) * 100
    }));

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-400" />
        Event Types
      </h3>
      <div className="grid gap-3">
        {sortedMetrics.map((metric) => (
          <Card
            key={metric.type}
            className="relative bg-slate-800 border-slate-700 hover:bg-slate-700/90 transition-all duration-300 overflow-hidden group"
          >
            {/* Heat map background */}
            <div 
              className="absolute inset-0 bg-blue-500/10"
              style={{
                width: `${metric.intensity}%`,
                transition: 'width 0.3s ease-in-out'
              }}
            />
            
            <div className="relative z-10 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-white">
                    {metric.type.replace('attack.', '')}
                  </h4>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-200 text-sm rounded-full font-mono">
                    {metric.count} events
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <div className="space-y-1">
                    <span className="text-xs text-blue-300 font-medium">First Seen</span>
                    <div className="text-sm text-white font-mono bg-slate-900/50 p-2 rounded">
                      {metric.firstSeen.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-blue-300 font-medium">Last Seen</span>
                    <div className="text-sm text-white font-mono bg-slate-900/50 p-2 rounded">
                      {metric.lastSeen.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TimelineEventTypes;
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
      <h3 className="text-sm font-medium text-blue-400 mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4" />
        Event Types
      </h3>
      <div className="grid gap-2">
        {sortedMetrics.map((metric) => (
          <Card
            key={metric.type}
            className="relative bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-800/90 hover:to-gray-900/90 border-gray-700/50 transition-all duration-300 overflow-hidden group"
          >
            {/* Heat map background */}
            <div 
              className="absolute inset-0 bg-blue-500/5"
              style={{
                width: `${metric.intensity}%`,
                transition: 'width 0.3s ease-in-out'
              }}
            />
            
            <div className="relative z-10 p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-gray-200 font-medium">
                    {metric.type.replace('attack.', '')}
                  </h4>
                  <div className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-2">
                    <span>{metric.firstSeen.toLocaleTimeString()}</span>
                    <span className="text-blue-400">→</span>
                    <span>{metric.lastSeen.toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-300 text-sm rounded-full font-mono">
                    {metric.count}
                  </span>
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
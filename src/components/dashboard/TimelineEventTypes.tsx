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
            className="p-3 bg-gradient-to-r from-black/40 to-blue-500/5 border-blue-500/10 hover:to-blue-500/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between relative overflow-hidden">
              <div className="z-10">
                <h4 className="text-blue-100 font-medium">{metric.type}</h4>
                <div className="text-xs text-blue-400 font-mono mt-1 flex items-center gap-2">
                  <span>{metric.firstSeen.toLocaleString()}</span>
                  <span className="text-blue-500">→</span>
                  <span>{metric.lastSeen.toLocaleString()}</span>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-sm rounded font-mono z-10">
                {metric.count}
              </span>
              {/* Heat map background */}
              <div 
                className="absolute inset-0 bg-blue-500/5"
                style={{
                  width: `${metric.intensity}%`,
                  transition: 'width 0.3s ease-in-out'
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TimelineEventTypes;
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
  tags: string[];
}

const TimelineEventTypes = ({ alerts }: TimelineEventTypesProps) => {
  const eventMetrics = alerts.reduce((acc: { [key: string]: EventMetric }, alert) => {
    const eventTypes = alert.tags.split(',').map(tag => tag.trim());
    const title = alert.title;
    
    if (!acc[title]) {
      acc[title] = {
        type: title,
        count: 0,
        firstSeen: new Date(alert.system_time),
        lastSeen: new Date(alert.system_time),
        intensity: 0,
        tags: []
      };
    }
    
    acc[title].count++;
    acc[title].firstSeen = new Date(Math.min(acc[title].firstSeen.getTime(), new Date(alert.system_time).getTime()));
    acc[title].lastSeen = new Date(Math.max(acc[title].lastSeen.getTime(), new Date(alert.system_time).getTime()));
    
    // Add unique tags
    eventTypes.forEach(tag => {
      if (!acc[title].tags.includes(tag)) {
        acc[title].tags.push(tag);
      }
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
    <div className="mb-6 w-full">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-400" />
        Event Types
      </h3>
      <div className="grid gap-3">
        {sortedMetrics.map((metric) => (
          <Card
            key={metric.type}
            className="relative bg-[#1a2234] border-slate-700/50 hover:bg-[#1e2943] transition-all duration-300 overflow-hidden group w-full"
          >
            <div 
              className="absolute inset-0 bg-blue-500/5"
              style={{
                width: `${metric.intensity}%`,
                transition: 'width 0.3s ease-in-out'
              }}
            />
            
            <div className="relative z-10 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-lg font-medium text-white">
                    {metric.type}
                  </h4>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-200 text-sm rounded-full font-mono whitespace-nowrap">
                    {metric.count} events
                  </span>
                </div>

                {/* Compact timestamp display */}
                <div className="flex items-center gap-4 text-xs text-blue-300 bg-[#151b2d] p-2 rounded mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">First:</span>
                    <span className="font-mono">{metric.firstSeen.toLocaleTimeString()}</span>
                  </div>
                  <div className="w-px h-4 bg-blue-500/20" />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Last:</span>
                    <span className="font-mono">{metric.lastSeen.toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {metric.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                    >
                      {tag}
                    </span>
                  ))}
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

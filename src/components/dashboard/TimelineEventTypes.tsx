import { Alert } from "./types";

interface EventTypeMetrics {
  type: string;
  firstSeen: Date;
  lastSeen: Date;
  count: number;
}

interface TimelineEventTypesProps {
  alerts: Alert[];
}

const TimelineEventTypes = ({ alerts }: TimelineEventTypesProps) => {
  // Calculate metrics for each event type
  const eventTypeMetrics = alerts.reduce((acc: EventTypeMetrics[], alert) => {
    const type = alert.title.split(':')[0].trim();
    const time = new Date(alert.system_time);
    
    const existing = acc.find(item => item.type === type);
    if (existing) {
      existing.count++;
      if (time < existing.firstSeen) existing.firstSeen = time;
      if (time > existing.lastSeen) existing.lastSeen = time;
    } else {
      acc.push({
        type,
        firstSeen: time,
        lastSeen: time,
        count: 1
      });
    }
    
    return acc;
  }, []);

  // Sort by count descending
  eventTypeMetrics.sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-2 bg-blue-950/20 p-4 rounded-lg border border-blue-500/20">
      <h3 className="text-lg font-semibold text-blue-300 mb-4">Event Types</h3>
      <div className="space-y-2">
        {eventTypeMetrics.map((metric) => (
          <div 
            key={metric.type}
            className="grid grid-cols-[1fr,auto] gap-4 items-center p-2 rounded bg-blue-900/20 hover:bg-blue-900/30 transition-colors"
          >
            <div>
              <h4 className="text-blue-100 font-medium">{metric.type}</h4>
              <div className="text-xs text-blue-400 font-mono mt-1 flex items-center gap-2">
                <span>{metric.firstSeen.toLocaleString()}</span>
                <span className="text-blue-500">→</span>
                <span>{metric.lastSeen.toLocaleString()}</span>
              </div>
            </div>
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-sm rounded font-mono">
              {metric.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineEventTypes;
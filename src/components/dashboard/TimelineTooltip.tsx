import { Alert } from './types';
import { getSeverityColor, getCategoryColor } from './utils/timelineDataUtils';
import { Badge } from "@/components/ui/badge";

interface TimelineTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      fullDate: string;
      count: number;
      events: Alert[];
      categories: { [key: string]: number };
      anomalyCount: number;
    };
  }>;
}

const TimelineTooltip = ({ active, payload }: TimelineTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const { fullDate, count, events, categories, anomalyCount } = payload[0].payload;

  return (
    <div className="bg-black/90 p-4 rounded-lg border border-blue-500/20 shadow-xl backdrop-blur-sm max-w-md">
      <p className="text-blue-300 font-mono text-sm mb-2">{fullDate}</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white font-medium">Total Events:</span>
        <Badge variant="secondary">{count}</Badge>
        {anomalyCount > 0 && (
          <Badge variant="destructive">
            {anomalyCount} Anomalies
          </Badge>
        )}
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-blue-200 mb-1">Categories:</p>
        <div className="flex flex-wrap gap-1">
          {Object.entries(categories).map(([category, count]) => (
            <Badge
              key={category}
              style={{ backgroundColor: getCategoryColor(category) }}
              className="text-white"
            >
              {category}: {count}
            </Badge>
          ))}
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto">
        <p className="text-sm text-blue-200 mb-1">Recent Events:</p>
        {events.slice(0, 3).map((event: Alert, index: number) => (
          <div 
            key={index} 
            className="text-sm text-blue-200/80 mb-1 border-l-2 pl-2" 
            style={{ borderColor: getSeverityColor(event.rule_level) }}
          >
            {event.title}
          </div>
        ))}
        {events.length > 3 && (
          <p className="text-xs text-blue-300/60 mt-1">
            +{events.length - 3} more events...
          </p>
        )}
      </div>
    </div>
  );
};

export default TimelineTooltip;
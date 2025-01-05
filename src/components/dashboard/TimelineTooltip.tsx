import { Alert } from './types';
import { getSeverityColor } from './utils/timelineDataUtils';

interface TimelineTooltipProps {
  active?: boolean;
  payload?: any[];
}

const TimelineTooltip = ({ active, payload }: TimelineTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const { fullDate, count, events } = payload[0].payload;

  return (
    <div className="bg-black/90 p-4 rounded-lg border border-blue-500/20 shadow-xl backdrop-blur-sm">
      <p className="text-blue-300 font-mono text-sm mb-2">{fullDate}</p>
      <p className="text-white font-medium mb-2">Total Events: {count}</p>
      <div className="max-h-32 overflow-y-auto">
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
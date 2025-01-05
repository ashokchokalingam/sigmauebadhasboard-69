import { Card } from "@/components/ui/card";
import { getTimelinePosition, getEventsInHour } from "./timelineUtils";

interface TimelineEventTypeCardProps {
  metric: {
    type: string;
    count: number;
    firstSeen: Date;
    lastSeen: Date;
    tags: string[];
    timelineEvents: { time: Date; count: number }[];
    weeklyActivity: number[];
  };
  isSelected: boolean;
  onSelect: (type: string) => void;
}

const TimelineEventTypeCard = ({ metric, isSelected, onSelect }: TimelineEventTypeCardProps) => {
  const formatDateTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <Card
      className={`relative bg-[#1a1f2c] border-[#3b82f6]/20 hover:bg-[#1e2943] transition-all duration-300 overflow-hidden group cursor-pointer
        ${isSelected ? 'ring-2 ring-[#3b82f6]' : ''}`}
      onClick={() => onSelect(metric.type)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-medium text-[#3b82f6]">
            {metric.type}
          </h4>
          <span className="px-4 py-2 bg-[#3b82f6]/10 text-[#3b82f6] text-base rounded-full">
            {metric.count} events
          </span>
        </div>

        {/* Weekly Activity Indicator */}
        <div className="flex gap-1 mb-4 h-2">
          {metric.weeklyActivity.slice().reverse().map((count, index) => {
            const maxCount = Math.max(...metric.weeklyActivity);
            const intensity = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div
                key={index}
                className="flex-1 bg-[#1a1f2c] rounded-full overflow-hidden"
                title={`${count} events ${6 - index} days ago`}
              >
                <div
                  className="h-full bg-[#3b82f6] transition-all duration-300"
                  style={{ width: `${intensity}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Daily Timeline with Hour Markers */}
        <div className="relative h-10 bg-[#1a1f2c] rounded-lg mb-4 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => {
            const eventsInHour = getEventsInHour(metric.timelineEvents, i);
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-[#3b82f6]/10 group/hour"
                style={{ left: `${(i / 24) * 100}%` }}
              >
                <span className="absolute -top-1 left-1 text-sm text-[#3b82f6]/50">
                  {i}
                </span>
                {eventsInHour > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover/hour:opacity-100 transition-opacity duration-200">
                    <div className="bg-[#1a1f2c] text-[#3b82f6] text-sm px-3 py-1.5 rounded whitespace-nowrap">
                      {eventsInHour} event{eventsInHour > 1 ? 's' : ''} at {i}:00
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {metric.timelineEvents.map((event, index) => (
            <div
              key={index}
              className="absolute top-2 h-6 w-1.5 bg-[#3b82f6] rounded-sm transform -translate-x-1/2 hover:h-7 hover:top-1.5 transition-all duration-200"
              style={{
                left: `${getTimelinePosition(event.time)}%`,
                opacity: 0.7
              }}
              title={`Event at ${event.time.toLocaleTimeString()}`}
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-[#1a1f2c] text-[#3b82f6] text-sm px-3 py-1.5 rounded whitespace-nowrap">
                  {event.time.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* First Seen and Last Seen */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-[#3b82f6]/70">First Seen</div>
            <div className="font-mono text-[#3b82f6]">{formatDateTime(metric.firstSeen)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[#3b82f6]/70">Last Seen</div>
            <div className="font-mono text-[#3b82f6]">{formatDateTime(metric.lastSeen)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimelineEventTypeCard;
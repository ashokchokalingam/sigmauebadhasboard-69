import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TimelineEventTimestampsProps {
  firstTimeSeen: string;
  lastTimeSeen: string;
}

const TimelineEventTimestamps = ({ firstTimeSeen, lastTimeSeen }: TimelineEventTimestampsProps) => {
  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return format(date, "MMM d, yyyy 'at' h:mm:ss a");
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
      <div className="flex items-center gap-2 text-blue-400/70">
        <Calendar className="h-4 w-4" />
        <span>First: {formatDateTime(firstTimeSeen || '')}</span>
      </div>
      <div className="flex items-center gap-2 text-purple-400/70">
        <Clock className="h-4 w-4" />
        <span>Last: {formatDateTime(lastTimeSeen || '')}</span>
      </div>
    </div>
  );
};

export default TimelineEventTimestamps;

import { Clock, Calendar } from "lucide-react";
import { formatDateTime } from "@/utils/dateTimeUtils";

interface TimelineEventTimestampsProps {
  firstTimeSeen: string;
  lastTimeSeen: string;
}

const TimelineEventTimestamps = ({ firstTimeSeen, lastTimeSeen }: TimelineEventTimestampsProps) => {
  const formatTimestamp = (dateStr: string) => {
    return formatDateTime(dateStr, false);
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
      <div className="flex items-center gap-2 text-blue-400/70">
        <Calendar className="h-4 w-4" />
        <span>First: {formatTimestamp(firstTimeSeen || '')}</span>
      </div>
      <div className="flex items-center gap-2 text-purple-400/70">
        <Clock className="h-4 w-4" />
        <span>Last: {formatTimestamp(lastTimeSeen || '')}</span>
      </div>
    </div>
  );
};

export default TimelineEventTimestamps;

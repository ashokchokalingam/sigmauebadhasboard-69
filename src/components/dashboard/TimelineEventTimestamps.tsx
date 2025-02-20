
import { Clock, Calendar } from "lucide-react";
import { formatDateTime } from "@/utils/dateTimeUtils";
import { Tooltip } from "@/components/ui/tooltip";

interface TimelineEventTimestampsProps {
  firstTimeSeen: string;
  lastTimeSeen: string;
}

const TimelineEventTimestamps = ({ firstTimeSeen, lastTimeSeen }: TimelineEventTimestampsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
      <Tooltip content="Last time this event was observed">
        <div className="flex items-center gap-2 text-purple-400/70">
          <Clock className="h-4 w-4" />
          <span>Last: {formatDateTime(lastTimeSeen)}</span>
        </div>
      </Tooltip>
      <Tooltip content="First time this event was observed">
        <div className="flex items-center gap-2 text-blue-400/70">
          <Calendar className="h-4 w-4" />
          <span>First: {formatDateTime(firstTimeSeen)}</span>
        </div>
      </Tooltip>
    </div>
  );
};

export default TimelineEventTimestamps;

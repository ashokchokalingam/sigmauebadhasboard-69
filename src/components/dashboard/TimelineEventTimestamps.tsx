
import { Clock, Calendar } from "lucide-react";
import { formatDateTime } from "@/utils/dateTimeUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimelineEventTimestampsProps {
  firstTimeSeen: string;
  lastTimeSeen: string;
}

const TimelineEventTimestamps = ({ firstTimeSeen, lastTimeSeen }: TimelineEventTimestampsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-purple-400/70">
              <Clock className="h-4 w-4" />
              <span>Last: {formatDateTime(lastTimeSeen, false)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Last time this event was observed</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-blue-400/70">
              <Calendar className="h-4 w-4" />
              <span>First: {formatDateTime(firstTimeSeen, false)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>First time this event was observed</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TimelineEventTimestamps;


import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { formatInTimeZone } from 'date-fns-tz';

interface TimelineEventTimestampsProps {
  firstSeen: string;
  lastSeen: string;
}

const TimelineEventTimestamps = ({ firstSeen, lastSeen }: TimelineEventTimestampsProps) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      utc: formatInTimeZone(date, 'UTC', "MMM dd, yyyy - HH:mm:ss 'UTC'"),
      local: formatInTimeZone(date, userTimezone, "MMM dd, yyyy - hh:mm:ss aa")
    };
  };

  const firstSeenFormatted = formatTimestamp(firstSeen);
  const lastSeenFormatted = formatTimestamp(lastSeen);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4 text-sm mt-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-purple-400/70">
              <span>Last seen:</span>
              <span>{lastSeenFormatted.local}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{lastSeenFormatted.utc}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-blue-400/70">
              <span>First seen:</span>
              <span>{firstSeenFormatted.local}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{firstSeenFormatted.utc}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TimelineEventTimestamps;

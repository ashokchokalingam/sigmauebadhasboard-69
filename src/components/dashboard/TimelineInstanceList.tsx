
import { Alert } from "./types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { formatInTimeZone } from 'date-fns-tz';

interface TimelineInstanceListProps {
  instances: Alert[];
  isExpanded: boolean;
  onToggle: () => void;
}

const TimelineInstanceList = ({ instances, isExpanded, onToggle }: TimelineInstanceListProps) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      utc: formatInTimeZone(date, 'UTC', "MMM dd, yyyy - HH:mm:ss 'UTC'"),
      local: formatInTimeZone(date, userTimezone, "MMM dd, yyyy - hh:mm:ss aa")
    };
  };

  if (!instances || instances.length <= 1) return null;

  return (
    <>
      <div 
        className="px-4 py-2 border-t border-blue-500/10 flex items-center justify-between cursor-pointer hover:bg-black/20"
        onClick={onToggle}
      >
        <span className="text-sm text-blue-300">
          {isExpanded ? 'Hide' : 'Show'} all instances ({instances.length})
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-blue-300" />
        ) : (
          <ChevronDown className="h-4 w-4 text-blue-300" />
        )}
      </div>

      {isExpanded && (
        <div className="px-4 py-3 border-t border-blue-500/10 space-y-2">
          {instances.map((instance, idx) => {
            const timestamp = formatTimestamp(instance.last_time_seen || instance.system_time);
            return (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-blue-300/70 flex justify-between items-center">
                      <span>Instance {idx + 1}</span>
                      <span>{timestamp.local}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{timestamp.utc}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TimelineInstanceList;

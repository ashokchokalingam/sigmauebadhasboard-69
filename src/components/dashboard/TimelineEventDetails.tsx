
import { cn } from "@/lib/utils";
import { Alert } from "./types";
import TimelineRawLog from "./TimelineRawLog";

interface TimelineEventDetailsProps {
  isExpanded: boolean;
  event: Alert;
  isLoading: boolean;
}

const TimelineEventDetails = ({ isExpanded, event, isLoading }: TimelineEventDetailsProps) => {
  return (
    <div className={cn(
      "overflow-hidden transition-all duration-300",
      isExpanded ? "max-h-[2000px]" : "max-h-0"
    )}>
      <div className="border-t border-purple-500/20 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>
              <span className="text-purple-400">Event ID:</span>
              <span className="ml-2 text-gray-300">{event.event_id}</span>
            </div>
            <div>
              <span className="text-purple-400">Provider Name:</span>
              <span className="ml-2 text-gray-300">{event.provider_name}</span>
            </div>
            <div>
              <span className="text-purple-400">Computer Name:</span>
              <span className="ml-2 text-gray-300">{event.computer_name}</span>
            </div>
            <div>
              <span className="text-purple-400">Task:</span>
              <span className="ml-2 text-gray-300">{event.task}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-purple-400">User ID:</span>
              <span className="ml-2 text-gray-300">{event.user_id}</span>
            </div>
            <div>
              <span className="text-purple-400">IP Address:</span>
              <span className="ml-2 text-gray-300">{event.ip_address || 'N/A'}</span>
            </div>
            <div>
              <span className="text-purple-400">Risk Level:</span>
              <span className="ml-2 text-gray-300">{event.rule_level}</span>
            </div>
            <div>
              <span className="text-purple-400">Risk Score:</span>
              <span className="ml-2 text-gray-300">{event.risk}</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-purple-400">Loading logs...</div>
        ) : (
          <TimelineRawLog alert={event} />
        )}
      </div>
    </div>
  );
};

export default TimelineEventDetails;

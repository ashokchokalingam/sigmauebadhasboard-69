import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading: boolean;
  totalRecords: number;
  entityType: "user" | "computer" | "origin";
}

const TimelineDetailedLogs = ({
  logs,
  isLoading,
  totalRecords,
  entityType
}: TimelineDetailedLogsProps) => {
  if (isLoading) {
    return (
      <div className="mt-4 p-4 border border-blue-500/10 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="mt-4 p-4 border border-blue-500/10 rounded-lg">
        <p className="text-center text-gray-400">No detailed logs available</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-blue-400">
          Detailed Logs ({totalRecords} events)
        </h4>
      </div>
      
      <ScrollArea className="h-[200px] rounded-lg border border-blue-500/10">
        <div className="space-y-2 p-4">
          {logs.map((log, index) => (
            <div
              key={`${log.id}-${index}`}
              className="p-3 bg-black/20 rounded-lg border border-blue-500/5 hover:border-blue-500/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-blue-300">
                  {new Date(log.system_time).toLocaleString()}
                </span>
                <span className="text-xs text-blue-400">
                  {entityType === "computer" ? log.computer_name : 
                   entityType === "origin" ? log.user_origin :
                   log.user_impacted}
                </span>
              </div>
              <p className="text-sm text-gray-300">{log.description}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineDetailedLogs;
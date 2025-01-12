import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading: boolean;
  totalRecords: number;
  entityType: "user" | "computer" | "origin";
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords, entityType }: TimelineDetailedLogsProps) => {
  if (isLoading) {
    return (
      <div className="mt-4 space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-blue-950/50 rounded-lg" />
        ))}
      </div>
    );
  }

  const getEntityIdentifier = (log: Alert) => {
    switch (entityType) {
      case "computer":
        return log.computer_name;
      case "user":
        return log.user_impacted;
      case "origin":
        return log.user_id; // Using user_id for origin users
      default:
        return "Unknown";
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-blue-300">
          Showing {logs.length} of {totalRecords} events
        </span>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div
              key={`${getEntityIdentifier(log)}-${index}`}
              className="p-4 rounded-lg bg-blue-950/30 border border-blue-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-200">
                  {log.title}
                </span>
                <span className="text-xs text-blue-400">
                  {new Date(log.system_time).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-blue-300/70">
                {log.description}
              </p>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center text-blue-300/70 py-8">
              No detailed logs available
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineDetailedLogs;
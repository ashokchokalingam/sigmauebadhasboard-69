import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
  entityType?: "user" | "computer";
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords, entityType = "user" }: TimelineDetailedLogsProps) => {
  if (isLoading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-400">
        No logs available
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ScrollArea className="h-[800px]">
        <div className="w-full border-r border-purple-400/20 bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C] shadow-xl">
          <div className="sticky top-0 z-20 p-4 flex justify-between items-center text-sm text-purple-200/80 border-b border-purple-400/20 bg-purple-400/5 backdrop-blur-sm">
            <div>
              <span className="font-semibold">Total Records:</span> {totalRecords?.toLocaleString()}
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {logs.map((log) => (
                <div 
                  key={log.id}
                  className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="text-purple-200 font-medium">{log.title}</span>
                      <span className="text-sm text-purple-300/70">
                        {new Date(log.system_time).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-purple-200/70">{log.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {log.tags?.split(',').map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineDetailedLogs;
import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading: boolean;
  totalRecords: number;
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords }: TimelineDetailedLogsProps) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!logs?.length) {
    return <p className="text-blue-300/70 text-sm">No detailed logs available</p>;
  }

  return (
    <div className="mt-4 border-t border-blue-500/10 pt-4">
      <h4 className="text-blue-100 font-medium mb-3">Detailed Logs ({totalRecords} events)</h4>
      <ScrollArea className="h-[300px] w-full rounded-md border border-blue-500/10 p-4">
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div key={index} className="p-3 rounded-md bg-black/20 border border-blue-500/5">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(log).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="text-blue-300/70 text-sm">{key}: </span>
                    <span className="text-blue-100 break-all font-mono text-xs">
                      {formatValue(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineDetailedLogs;
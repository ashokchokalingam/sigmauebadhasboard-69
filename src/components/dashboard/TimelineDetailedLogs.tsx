import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import TimelineLogCard from "./TimelineLogCard";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading: boolean;
  totalRecords: number;
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords }: TimelineDetailedLogsProps) => {
  const [expandedLogs, setExpandedLogs] = useState<string[]>([]);

  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev =>
      prev.includes(logId)
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
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

  const sortedLogs = [...logs].sort((a, b) =>
    new Date(b.system_time).getTime() - new Date(a.system_time).getTime()
  );

  return (
    <div className="mt-4 border-t border-blue-500/10 pt-4">
      <h4 className="text-blue-100 font-medium mb-3">Detailed Timeline ({totalRecords} events)</h4>
      <ScrollArea className="h-[500px] w-full rounded-md border border-blue-500/10">
        <div className="space-y-2 p-4">
          {sortedLogs.map((log) => (
            <TimelineLogCard
              key={log.id}
              log={log}
              isExpanded={expandedLogs.includes(log.id)}
              onToggleExpand={toggleExpand}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineDetailedLogs;
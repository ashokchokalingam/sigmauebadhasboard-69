import { useState } from "react";
import { Alert } from "./types";
import TimelineLogCard from "./TimelineLogCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords }: TimelineDetailedLogsProps) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden border border-blue-500/10 rounded-md">
      {totalRecords !== undefined && (
        <div className="p-2 text-sm text-blue-400 border-b border-blue-500/10">
          Total Records: {totalRecords}
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-black/90 backdrop-blur-sm sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-blue-300">Time</TableHead>
              <TableHead className="text-blue-300">Users</TableHead>
              <TableHead className="text-blue-300">Computer</TableHead>
              <TableHead className="text-blue-300">Event</TableHead>
              <TableHead className="text-blue-300">Tactics & Techniques</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TimelineLogCard
                key={log.id}
                log={log}
                isExpanded={expandedLogId === log.id}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TimelineDetailedLogs;
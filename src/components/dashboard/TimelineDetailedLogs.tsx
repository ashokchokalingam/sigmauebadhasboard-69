import { useState } from "react";
import { Alert } from "./types";
import TimelineLogCard from "./TimelineLogCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";

interface TimelineDetailedLogsProps {
  logs: Alert[];
}

const TimelineDetailedLogs = ({ logs }: TimelineDetailedLogsProps) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="w-full overflow-hidden border border-blue-500/10 rounded-md">
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
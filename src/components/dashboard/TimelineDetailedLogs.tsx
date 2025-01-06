import { useState } from "react";
import { Alert } from "./types";
import TimelineLogCard from "./TimelineLogCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import AlertDetailsView from "./AlertDetailsView";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords }: TimelineDetailedLogsProps) => {
  const [selectedLog, setSelectedLog] = useState<Alert | null>(null);

  const handleLogClick = (log: Alert) => {
    setSelectedLog(log);
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="w-full overflow-hidden border border-blue-500/10 rounded-md">
          {totalRecords !== undefined && (
            <div className="p-2 text-sm text-blue-400 border-b border-blue-500/10">
              Total Records: {totalRecords}
            </div>
          )}
          <div className="overflow-x-auto w-full">
            <Table className="w-full">
              <TableHeader className="bg-black/90 backdrop-blur-sm sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-b border-blue-500/10">
                  <TableHead className="w-[200px] text-blue-300 font-semibold">Time</TableHead>
                  <TableHead className="w-[250px] text-blue-300 font-semibold">Users</TableHead>
                  <TableHead className="w-[200px] text-blue-300 font-semibold">Computer</TableHead>
                  <TableHead className="min-w-[300px] text-blue-300 font-semibold">Event</TableHead>
                  <TableHead className="min-w-[250px] text-blue-300 font-semibold">Tactics & Techniques</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TimelineLogCard
                    key={log.id}
                    log={log}
                    isExpanded={selectedLog?.id === log.id}
                    onToggleExpand={() => handleLogClick(log)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {selectedLog && (
        <div className="w-[600px] border-l border-blue-500/10">
          <AlertDetailsView 
            alert={selectedLog} 
            onClose={() => setSelectedLog(null)}
          />
        </div>
      )}
    </div>
  );
};

export default TimelineDetailedLogs;
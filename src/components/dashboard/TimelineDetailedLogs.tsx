import { useState, useRef } from "react";
import { Alert } from "./types";
import TimelineLogCard from "./TimelineLogCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import DetailsPanel from "./TimelineDetailedLogs/DetailsPanel";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
  entityType?: "user" | "computer";
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords, entityType = "user" }: TimelineDetailedLogsProps) => {
  const [selectedLog, setSelectedLog] = useState<Alert | null>(null);
  const [visibleColumns] = useState<string[]>([
    "system_time",
    "user_id",
    "target_user_name",
    "computer_name",
    "title",
    "tags"
  ]);

  const handleLogClick = (log: Alert) => {
    console.log("Log clicked:", log);
    setSelectedLog(log);
  };

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
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-[800px] rounded-lg border border-purple-400/20"
      >
        <ResizablePanel 
          defaultSize={60}
          minSize={30}
        >
          <div className="h-full overflow-auto custom-scrollbar">
            <div className="w-full border-r border-purple-400/20 bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
              <div className="sticky top-0 z-20 p-4 flex justify-between items-center text-sm text-purple-200/80 border-b border-purple-400/20 bg-purple-400/5 backdrop-blur-sm">
                <div>
                  <span className="font-semibold">Total Records:</span> {totalRecords?.toLocaleString()}
                </div>
              </div>
              <Table>
                <TableHeader className="bg-purple-400/5 backdrop-blur-sm sticky top-0 z-10">
                  <TableRow className="hover:bg-transparent border-b border-purple-400/20">
                    <TableHead className="text-purple-100 font-semibold">Time</TableHead>
                    {entityType === "user" ? (
                      <TableHead className="text-purple-100 font-semibold">User Origin</TableHead>
                    ) : (
                      <TableHead className="text-purple-100 font-semibold">Computer Name</TableHead>
                    )}
                    <TableHead className="text-purple-100 font-semibold">User Impacted</TableHead>
                    <TableHead className="text-purple-100 font-semibold">Computer</TableHead>
                    <TableHead className="text-purple-100 font-semibold">Event</TableHead>
                    <TableHead className="text-purple-100 font-semibold">MITRE Tactics</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TimelineLogCard
                      key={log.id}
                      log={log}
                      isExpanded={selectedLog?.id === log.id}
                      onToggleExpand={handleLogClick}
                      visibleColumns={visibleColumns}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ResizablePanel>

        {selectedLog && (
          <>
            <ResizableHandle 
              withHandle 
              className="bg-purple-400/20 hover:bg-purple-400/30 transition-colors"
            />
            <ResizablePanel 
              defaultSize={40}
              minSize={30}
            >
              <div className="h-full">
                <DetailsPanel 
                  alert={selectedLog}
                  onClose={() => setSelectedLog(null)}
                />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default TimelineDetailedLogs;
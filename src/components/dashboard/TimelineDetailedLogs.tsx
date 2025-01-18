import { useState } from "react";
import { Alert } from "./types";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "../ui/table";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import DetailsPanel from "./TimelineDetailedLogs/DetailsPanel";
import { format } from "date-fns";
import { Shield, AlertTriangle } from "lucide-react";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
  entityType?: "user" | "computer";
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords, entityType = "user" }: TimelineDetailedLogsProps) => {
  const [selectedLog, setSelectedLog] = useState<Alert | null>(null);

  const handleLogClick = (log: Alert) => {
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
      <div className="w-full p-8 flex items-center justify-center text-purple-300/70">
        <AlertTriangle className="h-5 w-5 mr-2" />
        No logs available
      </div>
    );
  }

  const getRiskColor = (risk: number | null) => {
    if (!risk) return "text-purple-300/70";
    if (risk >= 80) return "text-red-400";
    if (risk >= 50) return "text-orange-400";
    return "text-green-400";
  };

  return (
    <div className="mt-4">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-[800px] rounded-lg border border-purple-500/20"
      >
        <ResizablePanel 
          defaultSize={selectedLog ? 60 : 100}
          minSize={30}
          className="relative h-full"
        >
          <div className="absolute inset-0 flex flex-col">
            <div className="sticky top-0 z-20 p-4 flex justify-between items-center text-base text-purple-200/80 border-b border-purple-500/20 bg-purple-950/90 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="font-medium text-lg">Total Records: {totalRecords?.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
              <Table>
                <TableHeader className="bg-purple-950/90 backdrop-blur-sm sticky top-0 z-10">
                  <TableRow className="hover:bg-transparent border-b border-purple-500/20">
                    <TableHead className="text-purple-100 font-medium text-base">Time</TableHead>
                    <TableHead className="text-purple-100 font-medium text-base">Risk</TableHead>
                    <TableHead className="text-purple-100 font-medium text-base">User</TableHead>
                    <TableHead className="text-purple-100 font-medium text-base">Computer</TableHead>
                    <TableHead className="text-purple-100 font-medium text-base">Event</TableHead>
                    <TableHead className="text-purple-100 font-medium text-base">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow 
                      key={log.id}
                      className={`hover:bg-purple-400/5 cursor-pointer ${selectedLog?.id === log.id ? 'bg-purple-400/10' : ''}`}
                      onClick={() => handleLogClick(log)}
                    >
                      <TableCell className="font-mono text-purple-200/90 text-base whitespace-nowrap">
                        {format(new Date(log.system_time), "MMM d, yyyy HH:mm:ss")}
                      </TableCell>
                      <TableCell className={`font-medium ${getRiskColor(log.risk)}`}>
                        {log.risk || 'N/A'}
                      </TableCell>
                      <TableCell className="text-purple-200/90 text-base">
                        {log.user_id || 'N/A'}
                      </TableCell>
                      <TableCell className="text-purple-200/90 text-base">
                        {log.computer_name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-purple-200">{log.title}</span>
                          <div className="flex flex-wrap gap-1">
                            {log.tactics?.split(',').map((tactic, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-300"
                              >
                                {tactic.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-purple-200/70 line-clamp-2">
                          {log.description}
                        </p>
                      </TableCell>
                    </TableRow>
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
              className="bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
            />
            
            <ResizablePanel 
              defaultSize={40}
              minSize={30}
            >
              <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
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
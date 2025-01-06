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
    setSelectedLog(log);  // Remove the toggle behavior
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1 overflow-hidden">
        <div className="w-full h-full border border-[#7B68EE]/20 rounded-md bg-[#1E1E2F]">
          {totalRecords !== undefined && (
            <div className="p-2 text-sm text-gray-400 border-b border-[#7B68EE]/20">
              Total Records: {totalRecords}
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#1E1E2F] sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-b border-[#7B68EE]/20">
                  <TableHead className="w-[200px] text-gray-300 font-semibold">Time</TableHead>
                  <TableHead className="w-[250px] text-gray-300 font-semibold">Users</TableHead>
                  <TableHead className="w-[200px] text-gray-300 font-semibold">Computer</TableHead>
                  <TableHead className="min-w-[300px] text-gray-300 font-semibold">Event</TableHead>
                  <TableHead className="min-w-[250px] text-gray-300 font-semibold">Tactics & Techniques</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TimelineLogCard
                    key={log.id}
                    log={log}
                    isExpanded={selectedLog?.id === log.id}
                    onToggleExpand={handleLogClick}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {selectedLog && (
        <div className="w-[600px] border-l border-[#7B68EE]/20 pl-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-200">{selectedLog.title}</h2>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Event Details</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">{selectedLog.description}</div>
                  <div className="text-xs text-gray-400">
                    First seen: {selectedLog.first_time_seen}
                  </div>
                  <div className="text-xs text-gray-400">
                    Last seen: {selectedLog.last_time_seen}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">User Information</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">User ID: {selectedLog.user_id}</div>
                  {selectedLog.target_user_name && (
                    <div className="text-sm text-gray-300">
                      Target User: {selectedLog.target_user_name}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">System Information</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">
                    Computer: {selectedLog.computer_name}
                  </div>
                  {selectedLog.event_id && (
                    <div className="text-sm text-gray-300">
                      Event ID: {selectedLog.event_id}
                    </div>
                  )}
                </div>
              </div>

              {selectedLog.raw && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Raw Data</h3>
                  <pre className="text-xs text-gray-300 bg-[#1E1E2F] p-4 rounded-md overflow-x-auto">
                    {typeof selectedLog.raw === 'string' 
                      ? selectedLog.raw 
                      : JSON.stringify(selectedLog.raw, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineDetailedLogs;
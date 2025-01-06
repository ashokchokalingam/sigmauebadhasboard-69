import { useState, useEffect, useRef } from "react";
import { Alert } from "./types";
import TimelineLogCard from "./TimelineLogCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import TimelineMetadataGrid from "./TimelineMetadataGrid";
import TimelineMitreSection from "./TimelineMitreSection";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";
import ColumnSelector from "./ColumnSelector";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords }: TimelineDetailedLogsProps) => {
  const [selectedLog, setSelectedLog] = useState<Alert | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "system_time",
    "user_id",
    "target_user_name",
    "computer_name",
    "title",
    "tags"
  ]);
  const detailsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside both the details pane and the table
      const isClickOutsideDetails = detailsRef.current && !detailsRef.current.contains(event.target as Node);
      const isClickOutsideTable = tableRef.current && !tableRef.current.contains(event.target as Node);
      
      // Only close if the click is outside both elements and not on any dropdown or modal
      if (isClickOutsideDetails && isClickOutsideTable) {
        const target = event.target as HTMLElement;
        // Check if the click is not on a dropdown or its children
        const isDropdownClick = target.closest('[role="dialog"]') || 
                              target.closest('[role="menu"]') ||
                              target.closest('[role="listbox"]');
        
        if (!isDropdownClick) {
          setSelectedLog(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogClick = (log: Alert) => {
    console.log("Log clicked:", log);
    setSelectedLog(log);
  };

  const handleColumnToggle = (columns: string[]) => {
    setVisibleColumns(columns);
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
          id="timeline-logs" 
          order={1} 
          defaultSize={60} 
          minSize={30}
        >
          <ScrollArea className="h-[800px]">
            <div ref={tableRef} className="h-full">
              <div className="w-full border-r border-purple-400/20 bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C] shadow-xl">
                <div className="sticky top-0 z-20 p-4 flex justify-between items-center text-sm text-purple-200/80 border-b border-purple-400/20 bg-purple-400/5 backdrop-blur-sm">
                  <div>
                    <span className="font-semibold">Total Records:</span> {totalRecords?.toLocaleString()}
                  </div>
                  <ColumnSelector
                    visibleColumns={visibleColumns}
                    onColumnToggle={handleColumnToggle}
                  />
                </div>
                <div className="relative">
                  <Table>
                    <TableHeader className="bg-purple-400/5 backdrop-blur-sm sticky top-0 z-10">
                      <TableRow className="hover:bg-transparent border-b border-purple-400/20">
                        <TableHead className="w-[160px] text-purple-100 font-semibold">Time</TableHead>
                        <TableHead className="w-[120px] text-purple-100 font-semibold">User Origin</TableHead>
                        <TableHead className="w-[120px] text-purple-100 font-semibold">User Impacted</TableHead>
                        <TableHead className="w-[140px] text-purple-100 font-semibold">Computer</TableHead>
                        <TableHead className="min-w-[200px] text-purple-100 font-semibold">Event</TableHead>
                        <TableHead className="w-[200px] text-purple-100 font-semibold">Tactics & Techniques</TableHead>
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
                          visibleColumns={visibleColumns}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>

        {selectedLog && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel 
              id="timeline-details" 
              order={2} 
              defaultSize={40} 
              minSize={30}
            >
              <ScrollArea className="h-[800px]">
                <div 
                  ref={detailsRef}
                  className="h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 space-y-6 bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
                    <div className="flex justify-between items-center sticky top-0 z-30 bg-[#1E1E2F] py-4">
                      <h2 className="text-xl font-semibold text-purple-100 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200">
                        {selectedLog.title}
                      </h2>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(null);
                        }}
                        className="text-purple-300 hover:text-purple-100 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-purple-400/10"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
                        <h3 className="text-sm font-medium text-purple-200 mb-2">Description</h3>
                        <p className="text-sm text-purple-100/90 leading-relaxed">{selectedLog.description}</p>
                      </div>

                      <TimelineMetadataGrid alert={selectedLog} />
                      
                      <TimelineMitreSection alert={selectedLog} />

                      <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
                        <h3 className="text-sm font-medium text-purple-200 mb-2">Raw Data</h3>
                        <pre className="text-sm text-purple-100/90 bg-[#1A1F2C] p-4 rounded-md overflow-x-auto font-mono">
                          {typeof selectedLog.raw === 'string' 
                            ? JSON.stringify(JSON.parse(selectedLog.raw), null, 2)
                            : JSON.stringify(selectedLog.raw, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default TimelineDetailedLogs;
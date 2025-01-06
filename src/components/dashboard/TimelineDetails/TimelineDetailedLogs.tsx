import { useState, useEffect, useRef } from "react";
import { Alert } from "../types";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../ui/resizable";
import { ScrollArea } from "../../ui/scroll-area";
import TimelineDetailsHeader from "./TimelineDetailsHeader";
import TimelineDetailsTable from "./TimelineDetailsTable";
import TimelineDetailsPanel from "./TimelineDetailsPanel";

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
    "tactics",
    "techniques"
  ]);
  const detailsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOutsideDetails = detailsRef.current && !detailsRef.current.contains(event.target as Node);
      const isClickOutsideTable = tableRef.current && !tableRef.current.contains(event.target as Node);
      
      const target = event.target as HTMLElement;
      const isDropdownClick = target.closest('[role="dialog"]') || 
                              target.closest('[role="menu"]') ||
                              target.closest('[role="listbox"]');
        
      if (isClickOutsideDetails && isClickOutsideTable && !isDropdownClick) {
        setSelectedLog(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                <TimelineDetailsHeader
                  totalRecords={totalRecords}
                  visibleColumns={visibleColumns}
                  onColumnToggle={setVisibleColumns}
                />
                <div className="relative">
                  <TimelineDetailsTable
                    logs={logs}
                    selectedLog={selectedLog}
                    onLogSelect={setSelectedLog}
                    visibleColumns={visibleColumns}
                  />
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
              <div ref={detailsRef} className="h-full" onClick={(e) => e.stopPropagation()}>
                <TimelineDetailsPanel
                  selectedLog={selectedLog}
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
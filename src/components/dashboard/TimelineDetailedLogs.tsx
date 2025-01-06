import { useState, useEffect, useRef } from "react";
import { Alert } from "./types";
import TimelineLogCard from "./TimelineLogCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";
import ColumnSelector from "./ColumnSelector";
import { Database } from "lucide-react";
import DetailHeader from "./TimelineDetailsSections/DetailHeader";
import DetailMetadata from "./TimelineDetailsSections/DetailMetadata";
import DetailTags from "./TimelineDetailsSections/DetailTags";

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
      if (!detailsRef.current || !tableRef.current) return;

      const target = event.target as HTMLElement;
      const isClickInDetails = detailsRef.current.contains(target);
      const isClickInTable = tableRef.current.contains(target);
      const isScrollbarClick = target.closest('.scrollbar-thumb');

      // Don't close if clicking inside details, table, or on scrollbar
      if (!isClickInDetails && !isClickInTable && !isScrollbarClick) {
        setSelectedLog(null);
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

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const renderDetailSection = (alert: Alert) => {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
        <DetailHeader 
          title={alert.title} 
          onClose={() => setSelectedLog(null)} 
        />

        <div className="space-y-6">
          <DetailMetadata alert={alert} formatTime={formatTime} />
          <DetailTags alert={alert} />

          <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-purple-200 mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" /> Raw Data
            </h3>
            <pre className="text-xs text-purple-100/90 bg-[#1A1F2C] p-4 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
              {typeof alert.raw === 'string' 
                ? JSON.stringify(JSON.parse(alert.raw), null, 2)
                : JSON.stringify(alert.raw, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
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
          <ScrollArea className="h-[800px]">
            <div ref={tableRef} className="h-full">
              <div className="w-full border-r border-purple-400/20 bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C] shadow-xl">
                <div className="sticky top-0 z-20 p-4 flex justify-between items-center text-sm text-purple-200/80 border-b border-purple-400/20 bg-purple-400/5 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="font-semibold">Total Records:</span> {totalRecords?.toLocaleString()}
                  </div>
                  <ColumnSelector
                    visibleColumns={visibleColumns}
                    onColumnToggle={handleColumnToggle}
                  />
                </div>
                <Table>
                  <TableHeader className="bg-purple-400/5 backdrop-blur-sm sticky top-0 z-10">
                    <TableRow className="hover:bg-transparent border-b border-purple-400/20">
                      <TableHead className="text-purple-100 font-semibold">Time</TableHead>
                      <TableHead className="text-purple-100 font-semibold">User Origin</TableHead>
                      <TableHead className="text-purple-100 font-semibold">User Impacted</TableHead>
                      <TableHead className="text-purple-100 font-semibold">Computer</TableHead>
                      <TableHead className="text-purple-100 font-semibold">Event</TableHead>
                      <TableHead className="text-purple-100 font-semibold">Tags</TableHead>
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
          </ScrollArea>
        </ResizablePanel>

        {selectedLog && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel 
              defaultSize={40}
              minSize={30}
            >
              <ScrollArea className="h-[800px]">
                <div 
                  ref={detailsRef}
                  className="h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {renderDetailSection(selectedLog)}
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
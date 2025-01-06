import { useState, useEffect, useRef } from "react";
import { Alert } from "./types";
import TimelineLogCard from "./TimelineLogCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";
import ColumnSelector from "./ColumnSelector";
import { 
  Shield, 
  Monitor, 
  User, 
  Hash, 
  Database, 
  Tag, 
  Terminal, 
  Info,
  Clock,
  Globe,
  Fingerprint,
  Building2
} from "lucide-react";
import DetailHeader from "./DetailedLogComponents/DetailHeader";
import DetailField from "./DetailedLogComponents/DetailField";
import DetailSection from "./DetailedLogComponents/DetailSection";

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
      const isClickOutsideDetails = detailsRef.current && !detailsRef.current.contains(event.target as Node);
      const isClickOutsideTable = tableRef.current && !tableRef.current.contains(event.target as Node);
      
      if (isClickOutsideDetails && isClickOutsideTable) {
        const target = event.target as HTMLElement;
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
        <DetailHeader title={alert.title} onClose={() => setSelectedLog(null)} />

        <div className="space-y-6">
          <DetailSection title="Description" icon={<Info className="h-4 w-4" />}>
            <p className="text-sm text-purple-100/90 leading-relaxed">
              {alert.description || 'No description available'}
            </p>
          </DetailSection>

          <div className="grid grid-cols-2 gap-4">
            <DetailField 
              label="Computer"
              value={alert.computer_name}
              icon={<Monitor className="h-4 w-4" />}
            />
            <DetailField 
              label="User ID"
              value={alert.user_id}
              icon={<User className="h-4 w-4" />}
            />
            <DetailField 
              label="Event ID"
              value={alert.event_id}
              icon={<Hash className="h-4 w-4" />}
            />
            <DetailField 
              label="Provider"
              value={alert.provider_name}
              icon={<Terminal className="h-4 w-4" />}
            />
            <DetailField 
              label="Rule ID"
              value={alert.ruleid}
              icon={<Shield className="h-4 w-4" />}
            />
            <DetailField 
              label="Rule Level"
              value={alert.rule_level}
              icon={<Info className="h-4 w-4" />}
            />
            <DetailField 
              label="Task"
              value={alert.task}
              icon={<Terminal className="h-4 w-4" />}
            />
            <DetailField 
              label="Target Domain"
              value={alert.target_domain_name}
              icon={<Building2 className="h-4 w-4" />}
            />
            <DetailField 
              label="Target User"
              value={alert.target_user_name}
              icon={<User className="h-4 w-4" />}
            />
            <DetailField 
              label="System Time"
              value={formatTime(alert.system_time)}
              icon={<Clock className="h-4 w-4" />}
            />
            <DetailField 
              label="IP Address"
              value={alert.ip_address}
              icon={<Globe className="h-4 w-4" />}
            />
            <DetailField 
              label="DBSCAN Cluster"
              value={alert.dbscan_cluster}
              icon={<Fingerprint className="h-4 w-4" />}
            />
          </div>

          <DetailSection title="Tags" icon={<Tag className="h-4 w-4" />}>
            <div className="flex flex-wrap gap-2">
              {alert.tags?.split(',').map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Raw Data" icon={<Database className="h-4 w-4" />}>
            <pre className="text-xs text-purple-100/90 bg-[#1A1F2C] p-4 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
              {typeof alert.raw === 'string' 
                ? JSON.stringify(JSON.parse(alert.raw), null, 2)
                : JSON.stringify(alert.raw, null, 2)}
            </pre>
          </DetailSection>
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
                  <div>
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

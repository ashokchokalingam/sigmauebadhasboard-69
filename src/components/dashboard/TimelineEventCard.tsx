
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "./utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineConnector from "./TimelineConnector";
import { toast } from "sonner";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useState } from "react";
import AlertDetailsView from "./AlertDetailsView";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect?: (id: string | null) => void;
  selectedEventId?: string | null;
  detailedLogs?: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  instances?: Alert[];
  isLoadingLogs?: boolean;
}

const TimelineEventCard = ({ 
  event, 
  isLast, 
  isLatest,
  entityType,
  onSelect,
  selectedEventId,
  detailedLogs,
  isExpanded,
  onToggleExpand,
  instances,
  isLoadingLogs
}: TimelineEventCardProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const handleClick = (alert: Alert) => {
    setSelectedAlert(selectedAlert?.id === alert.id ? null : alert);
    if (onSelect) {
      onSelect(alert.id === selectedEventId ? null : alert.id);
    }
  };

  const getRiskScoreClass = (risk: number | null) => {
    if (!risk) return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (risk >= 80) return "bg-red-500/10 text-red-400 border-red-500/20";
    if (risk >= 60) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (risk >= 40) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-green-500/10 text-green-400 border-green-500/20";
  };

  const renderMainTable = () => (
    <div className="w-full rounded-lg overflow-hidden bg-[#1A1F2C]">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-800">
            <TableHead className="w-[180px] text-[#9b87f5]">Time</TableHead>
            <TableHead className="w-[160px] text-[#9b87f5]">Computer Name</TableHead>
            <TableHead className="min-w-[250px] text-[#9b87f5]">Description</TableHead>
            <TableHead className="w-[120px] text-[#9b87f5]">Event ID</TableHead>
            <TableHead className="w-[120px] text-[#9b87f5]">ID</TableHead>
            <TableHead className="w-[160px] text-[#9b87f5]">IP Address</TableHead>
            <TableHead className="w-[120px] text-[#9b87f5]">ML Cluster</TableHead>
            <TableHead className="min-w-[350px] text-[#9b87f5]">ML Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow 
            className={cn(
              "cursor-pointer border-b border-slate-800/50",
              selectedAlert?.id === event.id ? "bg-purple-900/20" : "hover:bg-slate-800/50"
            )}
            onClick={() => handleClick(event)}
          >
            <TableCell className="font-medium text-slate-200">{event.system_time}</TableCell>
            <TableCell className="text-slate-300">{event.computer_name}</TableCell>
            <TableCell className="text-slate-300">{event.description}</TableCell>
            <TableCell className="text-slate-300">{event.event_id}</TableCell>
            <TableCell className="text-slate-300">{event.id}</TableCell>
            <TableCell className="text-slate-300">{event.ip_address || 'null'}</TableCell>
            <TableCell>
              <Badge 
                variant="outline" 
                className="bg-blue-500/10 text-blue-400 border-blue-500/20"
              >
                {event.ml_cluster || '-1'}
              </Badge>
            </TableCell>
            <TableCell className="text-slate-300 max-w-[350px] truncate">
              {event.ml_description || 'No ML description available'}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="w-full">
      {selectedAlert ? (
        <ResizablePanelGroup 
          direction="horizontal" 
          className="min-h-[800px] rounded-lg bg-[#1A1F2C]"
        >
          <ResizablePanel defaultSize={70}>
            <div className="h-full overflow-auto">
              {renderMainTable()}
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-slate-800" />
          
          <ResizablePanel defaultSize={30}>
            <AlertDetailsView 
              alert={selectedAlert} 
              onClose={() => setSelectedAlert(null)} 
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        renderMainTable()
      )}
    </div>
  );
};

export default TimelineEventCard;

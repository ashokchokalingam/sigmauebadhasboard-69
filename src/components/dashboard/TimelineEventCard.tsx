
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
import { Shield, Brain, AlertTriangle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const AlertDetails = ({ alert, onClose }: { alert: Alert; onClose: () => void }) => {
  return (
    <div className="h-full flex flex-col bg-[#1E1E2F]">
      <div className="flex items-center justify-between p-4 border-b border-purple-900/20">
        <h2 className="text-lg font-semibold text-white">Alert Details</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-6">
            <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4">Alert Overview</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9] mb-1">Title</h4>
                <p className="text-xl text-white font-medium">{alert.title || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9] mb-1">Description</h4>
                <p className="text-base text-[#E0E0E0] leading-relaxed">{alert.description || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9] mb-1">Risk Score</h4>
                  <p className="text-2xl font-semibold text-green-400">
                    {alert.risk ? `${alert.risk}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9] mb-1">ML Cluster</h4>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20">
                      {alert.ml_cluster || 'No Cluster'}
                    </span>
                  </div>
                </div>
              </div>
              {alert.ml_description && (
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4" />
                    ML Analysis
                  </h4>
                  <p className="text-base text-[#E0E0E0] leading-relaxed">
                    {alert.ml_description}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Rule ID</h4>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#7B68EE]" />
                <p className="text-sm text-[#E0E0E0] font-mono">
                  {alert.ruleid || 'N/A'}
                </p>
              </div>
            </Card>

            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Severity</h4>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#7B68EE]" />
                <p className="text-sm text-[#E0E0E0] capitalize">
                  {alert.rule_level || 'N/A'}
                </p>
              </div>
            </Card>

            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
              <h4 className="text-sm font-medium text-[#A9A9A9] mb-2">Task</h4>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#7B68EE]" />
                <p className="text-sm text-[#E0E0E0]">
                  {alert.task || 'N/A'}
                </p>
              </div>
            </Card>
          </div>

          {alert.tags && (
            <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-6">
              <h3 className="text-2xl font-bold text-[#5856D6] mb-6">MITRE ATT&CK</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#E2E8F0] mb-3">Tactics</h4>
                  <div className="flex flex-wrap gap-3">
                    {alert.tags.split(',')
                      .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
                      .map((tactic, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-[#5856D6]/10 text-[#5856D6] text-base font-medium rounded-lg 
                            border border-[#5856D6]/30 hover:bg-[#5856D6]/20 transition-colors"
                        >
                          {tactic.replace('attack.', '').split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#E2E8F0] mb-3">Techniques</h4>
                  <div className="flex flex-wrap gap-3">
                    {alert.tags.split(',')
                      .filter(tag => tag.toLowerCase().includes('t1'))
                      .map((technique, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-[#5856D6]/10 text-[#5856D6] text-base font-medium rounded-lg 
                            border border-[#5856D6]/30 hover:bg-[#5856D6]/20 transition-colors"
                        >
                          {technique.trim()}
                        </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

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

  return (
    <div className="w-full">
      {selectedAlert ? (
        <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border border-slate-800">
          <ResizablePanel defaultSize={70}>
            <div className="h-full bg-[#1A1F2C] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-800">
                    <TableHead className="w-[180px]">Time</TableHead>
                    <TableHead className="w-[160px]">User Origin</TableHead>
                    <TableHead className="w-[160px]">User Impacted</TableHead>
                    <TableHead className="min-w-[250px]">Title</TableHead>
                    <TableHead className="w-[160px]">Computer</TableHead>
                    <TableHead className="min-w-[350px]">Description</TableHead>
                    <TableHead className="w-[160px]">IP Address</TableHead>
                    <TableHead className="w-[140px]">Rule Level</TableHead>
                    <TableHead className="w-[140px]">Risk Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow 
                    key={event.id}
                    className="cursor-pointer hover:bg-slate-800/50"
                    onClick={() => handleClick(event)}
                  >
                    <TableCell className="font-medium">{event.system_time}</TableCell>
                    <TableCell>{event.user_origin}</TableCell>
                    <TableCell>{event.user_impacted}</TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.computer_name}</TableCell>
                    <TableCell className="max-w-[350px] truncate">{event.description}</TableCell>
                    <TableCell>{event.ip_address || 'none'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {event.rule_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                        {event.risk ? `${event.risk}%` : 'N/A'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={30}>
            <AlertDetails 
              alert={selectedAlert} 
              onClose={() => setSelectedAlert(null)} 
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-800">
              <TableHead className="w-[180px]">Time</TableHead>
              <TableHead className="w-[160px]">User Origin</TableHead>
              <TableHead className="w-[160px]">User Impacted</TableHead>
              <TableHead className="min-w-[250px]">Title</TableHead>
              <TableHead className="w-[160px]">Computer</TableHead>
              <TableHead className="min-w-[350px]">Description</TableHead>
              <TableHead className="w-[160px]">IP Address</TableHead>
              <TableHead className="w-[140px]">Rule Level</TableHead>
              <TableHead className="w-[140px]">Risk Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              key={event.id}
              className="cursor-pointer hover:bg-slate-800/50"
              onClick={() => handleClick(event)}
            >
              <TableCell className="font-medium">{event.system_time}</TableCell>
              <TableCell>{event.user_origin}</TableCell>
              <TableCell>{event.user_impacted}</TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.computer_name}</TableCell>
              <TableCell className="max-w-[350px] truncate">{event.description}</TableCell>
              <TableCell>{event.ip_address || 'none'}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {event.rule_level}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  {event.risk ? `${event.risk}%` : 'N/A'}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TimelineEventCard;

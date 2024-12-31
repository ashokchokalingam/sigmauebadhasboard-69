import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import AlertDetailsView from "./AlertDetailsView";
import TimelineView from "./TimelineView";
import { useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  User, 
  Monitor, 
  Calendar, 
  Hash, 
  Database,
  Tag,
  FileText,
  Server,
  Activity,
  UserCheck,
  Globe,
  Clock,
  AlertCircle,
  Layers,
  Code
} from "lucide-react";

interface DetailsSidebarProps {
  selectedAlert: Alert | null;
  timelineView: { type: "user" | "computer"; id: string } | null;
  alerts: Alert[];
  onTimelineClose: () => void;
}

const DetailsSidebar = ({ 
  selectedAlert, 
  timelineView, 
  alerts,
  onTimelineClose 
}: DetailsSidebarProps) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onTimelineClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onTimelineClose]);

  if (!selectedAlert && !timelineView) return null;

  const MetadataField = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number | null }) => {
    if (value === null || value === undefined || value === '') return null;
    
    return (
      <div className="flex items-start gap-3 p-3 bg-sidebar/20 rounded-lg">
        <Icon className="h-5 w-5 text-blue-400 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-400">{label}</p>
          <p className="text-sm text-blue-100 font-mono break-all">
            {typeof value === 'object' ? JSON.stringify(value) : value}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-[90vh] w-[90vw] max-w-[1400px] min-w-[600px] rounded-lg bg-background"
        >
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full overflow-y-auto scrollbar-thin">
              {selectedAlert && (
                <Card className="h-full border-none rounded-none">
                  <CardContent className="p-6">
                    <AlertDetailsView alert={selectedAlert} />
                  </CardContent>
                </Card>
              )}
              {timelineView && (
                <Card className="h-full border-none rounded-none">
                  <CardContent className="p-6">
                    <TimelineView
                      alerts={alerts}
                      entityType={timelineView.type}
                      entityId={timelineView.id}
                      onClose={onTimelineClose}
                      inSidebar={true}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full overflow-y-auto scrollbar-thin p-6">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              {selectedAlert && (
                <div className="grid grid-cols-1 gap-4">
                  <MetadataField 
                    icon={AlertCircle} 
                    label="Title" 
                    value={selectedAlert.title} 
                  />
                  <MetadataField 
                    icon={Tag} 
                    label="Tags" 
                    value={selectedAlert.tags} 
                  />
                  <MetadataField 
                    icon={FileText} 
                    label="Description" 
                    value={selectedAlert.description} 
                  />
                  <MetadataField 
                    icon={Clock} 
                    label="System Time" 
                    value={selectedAlert.system_time ? new Date(selectedAlert.system_time).toLocaleString() : null} 
                  />
                  <MetadataField 
                    icon={Server} 
                    label="Computer Name" 
                    value={selectedAlert.computer_name} 
                  />
                  <MetadataField 
                    icon={User} 
                    label="User ID" 
                    value={selectedAlert.user_id} 
                  />
                  <MetadataField 
                    icon={Hash} 
                    label="Event ID" 
                    value={selectedAlert.event_id} 
                  />
                  <MetadataField 
                    icon={Activity} 
                    label="Provider Name" 
                    value={selectedAlert.provider_name} 
                  />
                  <MetadataField 
                    icon={Layers} 
                    label="DBSCAN Cluster" 
                    value={selectedAlert.dbscan_cluster} 
                  />
                  <MetadataField 
                    icon={Globe} 
                    label="IP Address" 
                    value={selectedAlert.ip_address} 
                  />
                  <MetadataField 
                    icon={Shield} 
                    label="Rule ID" 
                    value={selectedAlert.ruleid} 
                  />
                  <MetadataField 
                    icon={AlertTriangle} 
                    label="Rule Level" 
                    value={selectedAlert.rule_level} 
                  />
                  <MetadataField 
                    icon={Info} 
                    label="Task" 
                    value={selectedAlert.task} 
                  />
                  <MetadataField 
                    icon={UserCheck} 
                    label="Target User" 
                    value={selectedAlert.target_user_name} 
                  />
                  <MetadataField 
                    icon={Database} 
                    label="Target Domain" 
                    value={selectedAlert.target_domain_name} 
                  />
                  {selectedAlert.raw && (
                    <MetadataField 
                      icon={Code} 
                      label="Raw Log Data" 
                      value={selectedAlert.raw} 
                    />
                  )}
                </div>
              )}
              {!selectedAlert && (
                <p className="text-muted-foreground">Select an alert to view details.</p>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DetailsSidebar;
import { Alert } from "./types";
import MetadataField from "./MetadataField";
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
  Code,
  MessageSquare,
  Network,
  Lock,
  Flag,
  Terminal
} from "lucide-react";

interface MetadataPanelProps {
  selectedAlert: Alert | null;
}

const MetadataPanel = ({ selectedAlert }: MetadataPanelProps) => {
  if (!selectedAlert) {
    return <p className="text-muted-foreground">Select an alert to view details.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 pb-8 max-h-[calc(95vh-4rem)] overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Basic Information</h3>
        <MetadataField icon={AlertCircle} label="Title" value={selectedAlert.title} />
        <MetadataField icon={MessageSquare} label="Description" value={selectedAlert.description} />
        <MetadataField icon={Shield} label="Rule ID" value={selectedAlert.ruleid} />
        <MetadataField icon={AlertTriangle} label="Rule Level" value={selectedAlert.rule_level} />
        <MetadataField icon={Info} label="Task" value={selectedAlert.task} />
      </div>

      {/* Time and System Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Time and System Information</h3>
        <MetadataField 
          icon={Clock} 
          label="System Time" 
          value={selectedAlert.system_time ? new Date(selectedAlert.system_time).toLocaleString() : null} 
        />
        <MetadataField icon={Server} label="Computer Name" value={selectedAlert.computer_name} />
        <MetadataField icon={Globe} label="IP Address" value={selectedAlert.ip_address} />
        <MetadataField icon={Network} label="Provider Name" value={selectedAlert.provider_name} />
      </div>

      {/* User Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">User Information</h3>
        <MetadataField icon={User} label="User ID" value={selectedAlert.user_id} />
        <MetadataField icon={UserCheck} label="Target User" value={selectedAlert.target_user_name} />
        <MetadataField icon={Database} label="Target Domain" value={selectedAlert.target_domain_name} />
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Event Details</h3>
        <MetadataField icon={Hash} label="Event ID" value={selectedAlert.event_id} />
        <MetadataField icon={Tag} label="Tags" value={selectedAlert.tags} />
        <MetadataField icon={Layers} label="DBSCAN Cluster" value={selectedAlert.dbscan_cluster} />
      </div>

      {/* Raw Log Data */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Raw Log Data</h3>
        <MetadataField icon={Terminal} label="Raw Log" value={selectedAlert.raw} isRawLog={true} />
      </div>
    </div>
  );
};

export default MetadataPanel;
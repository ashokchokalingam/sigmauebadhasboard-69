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
  MessageSquare
} from "lucide-react";

interface MetadataPanelProps {
  selectedAlert: Alert | null;
}

const MetadataPanel = ({ selectedAlert }: MetadataPanelProps) => {
  if (!selectedAlert) {
    return <p className="text-muted-foreground">Select an alert to view details.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <MetadataField icon={AlertCircle} label="Title" value={selectedAlert.title} />
      <MetadataField icon={MessageSquare} label="Description" value={selectedAlert.description} />
      <MetadataField icon={Tag} label="Tags" value={selectedAlert.tags} />
      <MetadataField 
        icon={Clock} 
        label="System Time" 
        value={selectedAlert.system_time ? new Date(selectedAlert.system_time).toLocaleString() : null} 
      />
      <MetadataField icon={Server} label="Computer Name" value={selectedAlert.computer_name} />
      <MetadataField icon={User} label="User ID" value={selectedAlert.user_id} />
      <MetadataField icon={Hash} label="Event ID" value={selectedAlert.event_id} />
      <MetadataField icon={Activity} label="Provider Name" value={selectedAlert.provider_name} />
      <MetadataField icon={Layers} label="DBSCAN Cluster" value={selectedAlert.dbscan_cluster} />
      <MetadataField icon={Globe} label="IP Address" value={selectedAlert.ip_address} />
      <MetadataField icon={Shield} label="Rule ID" value={selectedAlert.ruleid} />
      <MetadataField icon={AlertTriangle} label="Rule Level" value={selectedAlert.rule_level} />
      <MetadataField icon={Info} label="Task" value={selectedAlert.task} />
      <MetadataField icon={UserCheck} label="Target User" value={selectedAlert.target_user_name} />
      <MetadataField icon={Database} label="Target Domain" value={selectedAlert.target_domain_name} />
      <MetadataField icon={Code} label="Raw Log Data" value={selectedAlert.raw} isRawLog={true} />
    </div>
  );
};

export default MetadataPanel;
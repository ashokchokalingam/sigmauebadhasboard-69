import { Alert } from "./types";
import MetadataField from "./MetadataField";
import { 
  AlertTriangle,
  AlertCircle,
  Tag,
  Clock,
  Monitor,
  User,
  Hash,
  Server,
  Network,
  Shield,
  Activity,
  UserCheck,
  Globe,
  Database,
  Terminal,
  FileText,
  Info,
  Flag,
  MessageSquare,
  Layers,
  Lock,
  Building
} from "lucide-react";

interface MetadataPanelProps {
  selectedAlert: Alert | null;
}

const MetadataPanel = ({ selectedAlert }: MetadataPanelProps) => {
  if (!selectedAlert) {
    return <p className="text-purple-400">Select an alert to view details.</p>;
  }

  const fields = [
    { icon: AlertCircle, label: "Title", value: selectedAlert.title },
    { icon: Tag, label: "Tags", value: selectedAlert.tags },
    { icon: MessageSquare, label: "Description", value: selectedAlert.description },
    { icon: Clock, label: "System Time", value: selectedAlert.system_time ? new Date(selectedAlert.system_time).toLocaleString() : null },
    { icon: Monitor, label: "Computer Name", value: selectedAlert.computer_name },
    { icon: User, label: "User ID", value: selectedAlert.user_id },
    { icon: Hash, label: "Event ID", value: selectedAlert.event_id },
    { icon: Server, label: "Provider Name", value: selectedAlert.provider_name },
    { icon: Network, label: "IP Address", value: selectedAlert.ip_address },
    { icon: Layers, label: "DBSCAN Cluster", value: selectedAlert.dbscan_cluster },
    { icon: Shield, label: "Rule ID", value: selectedAlert.ruleid },
    { icon: AlertTriangle, label: "Rule Level", value: selectedAlert.rule_level },
    { icon: Activity, label: "Task", value: selectedAlert.task },
    { icon: UserCheck, label: "Target User Name", value: selectedAlert.target_user_name },
    { icon: Building, label: "Target Domain Name", value: selectedAlert.target_domain_name },
    { icon: Terminal, label: "Raw Log", value: selectedAlert.raw, isRawLog: true }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 pb-8">
      {fields.map((field, index) => (
        <MetadataField
          key={index}
          icon={field.icon}
          label={field.label}
          value={field.value}
          isRawLog={field.isRawLog}
        />
      ))}
    </div>
  );
};

export default MetadataPanel;
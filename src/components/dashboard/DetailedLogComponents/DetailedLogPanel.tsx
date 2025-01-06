import { Alert } from "../types";
import { ScrollArea } from "../../ui/scroll-area";
import { Shield, Monitor, User, Hash, Database, Tag, Terminal, Info, Clock, Globe, Fingerprint, Building2, AlertTriangle, Network, FileText } from "lucide-react";
import DetailHeader from "./DetailHeader";
import DetailField from "./DetailField";
import DetailSection from "./DetailSection";

interface DetailedLogPanelProps {
  alert: Alert;
  onClose: () => void;
}

const DetailedLogPanel = ({ alert, onClose }: DetailedLogPanelProps) => {
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

  return (
    <ScrollArea className="h-[800px]">
      <div className="p-6 space-y-6 bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
        <DetailHeader title={alert.title} onClose={onClose} />

        <div className="space-y-6">
          <DetailSection 
            title="Alert Overview" 
            icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
            className="border-l-4 border-l-yellow-500/50"
          >
            <div className="space-y-4">
              <p className="text-sm text-purple-100/90 leading-relaxed">
                {alert.description || 'No description available'}
              </p>
              <div className="grid grid-cols-3 gap-4 bg-black/20 p-4 rounded-lg">
                <DetailField 
                  label="Severity"
                  value={alert.rule_level}
                  icon={<Shield className="h-4 w-4 text-red-400" />}
                  className="text-red-400"
                />
                <DetailField 
                  label="Rule ID"
                  value={alert.ruleid}
                  icon={<Hash className="h-4 w-4 text-blue-400" />}
                />
                <DetailField 
                  label="Event ID"
                  value={alert.event_id}
                  icon={<Terminal className="h-4 w-4 text-green-400" />}
                />
              </div>
            </div>
          </DetailSection>

          <DetailSection 
            title="System Information" 
            icon={<Monitor className="h-4 w-4 text-blue-400" />}
            className="border-l-4 border-l-blue-500/50"
          >
            <div className="grid grid-cols-2 gap-4">
              <DetailField 
                label="Computer"
                value={alert.computer_name}
                icon={<Monitor className="h-4 w-4" />}
              />
              <DetailField 
                label="IP Address"
                value={alert.ip_address}
                icon={<Network className="h-4 w-4" />}
              />
              <DetailField 
                label="Provider"
                value={alert.provider_name}
                icon={<Terminal className="h-4 w-4" />}
              />
              <DetailField 
                label="Task"
                value={alert.task}
                icon={<FileText className="h-4 w-4" />}
              />
            </div>
          </DetailSection>

          <DetailSection 
            title="User Information" 
            icon={<User className="h-4 w-4 text-purple-400" />}
            className="border-l-4 border-l-purple-500/50"
          >
            <div className="grid grid-cols-2 gap-4">
              <DetailField 
                label="User ID"
                value={alert.user_id}
                icon={<User className="h-4 w-4" />}
              />
              <DetailField 
                label="Target User"
                value={alert.target_user_name}
                icon={<User className="h-4 w-4" />}
              />
              <DetailField 
                label="Target Domain"
                value={alert.target_domain_name}
                icon={<Building2 className="h-4 w-4" />}
              />
              <DetailField 
                label="DBSCAN Cluster"
                value={alert.dbscan_cluster}
                icon={<Fingerprint className="h-4 w-4" />}
              />
            </div>
          </DetailSection>

          <DetailSection 
            title="Temporal Information" 
            icon={<Clock className="h-4 w-4 text-cyan-400" />}
            className="border-l-4 border-l-cyan-500/50"
          >
            <div className="grid grid-cols-2 gap-4">
              <DetailField 
                label="System Time"
                value={formatTime(alert.system_time)}
                icon={<Clock className="h-4 w-4" />}
              />
              <DetailField 
                label="First Seen"
                value={formatTime(alert.first_time_seen || alert.system_time)}
                icon={<Clock className="h-4 w-4" />}
              />
              <DetailField 
                label="Last Seen"
                value={formatTime(alert.last_time_seen || alert.system_time)}
                icon={<Clock className="h-4 w-4" />}
              />
              <DetailField 
                label="Total Events"
                value={alert.total_events?.toString() || "1"}
                icon={<Hash className="h-4 w-4" />}
              />
            </div>
          </DetailSection>

          <DetailSection 
            title="Tags" 
            icon={<Tag className="h-4 w-4 text-emerald-400" />}
            className="border-l-4 border-l-emerald-500/50"
          >
            <div className="flex flex-wrap gap-2">
              {alert.tags?.split(',').map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-full border border-emerald-500/20"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </DetailSection>

          <DetailSection 
            title="Raw Data" 
            icon={<Database className="h-4 w-4 text-indigo-400" />}
            className="border-l-4 border-l-indigo-500/50"
          >
            <pre className="text-xs text-purple-100/90 bg-black/40 p-4 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
              {typeof alert.raw === 'string' 
                ? JSON.stringify(JSON.parse(alert.raw), null, 2)
                : JSON.stringify(alert.raw, null, 2)}
            </pre>
          </DetailSection>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DetailedLogPanel;
import { Alert } from "../types";
import { getSeverityColor, getSeverityBgColor } from "../utils/severityUtils";
import { Shield, Monitor, User, Hash, Database, Tag, Terminal, Info } from "lucide-react";

interface MetadataGridProps {
  alert: Alert;
}

const MetadataGrid = ({ alert }: MetadataGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
          <Monitor className="h-4 w-4" /> Computer
        </h4>
        <p className="text-sm text-blue-100 font-mono">{alert.computer_name || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
          <User className="h-4 w-4" /> User Origin
        </h4>
        <p className="text-sm text-blue-100 font-mono">{alert.user_id || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
          <Hash className="h-4 w-4" /> Event ID
        </h4>
        <p className="text-sm text-blue-100 font-mono">{alert.event_id || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
          <Terminal className="h-4 w-4" /> Provider
        </h4>
        <p className="text-sm text-blue-100 font-mono">{alert.provider_name || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
          <Shield className="h-4 w-4" /> Rule ID
        </h4>
        <p className="text-sm text-blue-100 font-mono">{alert.ruleid || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
          <Info className="h-4 w-4" /> Severity
        </h4>
        <div className={`inline-flex items-center px-2 py-1 rounded-full ${getSeverityBgColor(alert.rule_level)}`}>
          <p className={`text-sm font-medium capitalize ${getSeverityColor(alert.rule_level)}`}>
            {alert.rule_level || 'N/A'}
          </p>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400">Task</h4>
        <p className="text-sm text-blue-100 font-mono capitalize">{alert.task || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400">Target Domain</h4>
        <p className="text-sm text-blue-100 font-mono">{alert.target_domain_name || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400">Target User</h4>
        <p className="text-sm text-blue-100 font-mono">{alert.target_user_name || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400">System Time</h4>
        <p className="text-sm text-blue-100 font-mono">{new Date(alert.system_time).toLocaleString()}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400">IP Address</h4>
        <p className="text-sm text-blue-100 font-mono">{alert.ip_address || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-blue-400">ML Cluster</h4>
        <p className="text-sm text-blue-100 font-mono">{alert.ml_cluster || 'N/A'}</p>
      </div>
    </div>
  );
};

export default MetadataGrid;
import { Computer, Network, Hash, Terminal, User, Globe, Clock } from "lucide-react";
import { Alert } from "../types";

interface SystemInfoProps {
  alert: Alert;
}

const SystemInfo = ({ alert }: SystemInfoProps) => {
  const browserTime = new Date(alert.system_time).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-blue-100 border-b border-blue-500/10 pb-2">System Information</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pl-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Computer className="h-4 w-4" />
            <span className="text-sm">Computer Name</span>
          </div>
          <p className="text-blue-200 pl-6">{alert.computer_name || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Network className="h-4 w-4" />
            <span className="text-sm">IP Address</span>
          </div>
          <p className="text-blue-200 font-mono pl-6">{alert.ip_address || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <User className="h-4 w-4" />
            <span className="text-sm">User ID</span>
          </div>
          <p className="text-blue-200 pl-6">{alert.user_id || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Hash className="h-4 w-4" />
            <span className="text-sm">Event ID</span>
          </div>
          <p className="text-blue-200 pl-6">{alert.event_id || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Terminal className="h-4 w-4" />
            <span className="text-sm">Provider</span>
          </div>
          <p className="text-blue-200 pl-6">{alert.provider_name || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <User className="h-4 w-4" />
            <span className="text-sm">Target User</span>
          </div>
          <p className="text-blue-200 pl-6">{alert.target_user_name || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Globe className="h-4 w-4" />
            <span className="text-sm">Target Domain</span>
          </div>
          <p className="text-blue-200 pl-6">{alert.target_domain_name || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">System Time</span>
          </div>
          <p className="text-blue-200 pl-6">{browserTime || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
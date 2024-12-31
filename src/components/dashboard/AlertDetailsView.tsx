import { Alert } from "./types";
import { X } from "lucide-react";
import TimelineRawLog from "./TimelineRawLog";
import { Card } from "@/components/ui/card";

interface AlertDetailsViewProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  const browserTime = new Date(alert.system_time).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  const tactics = alert.tags?.split(',')
    .filter(tag => tag.includes('attack.'))
    .map(tag => tag.replace('attack.', ''))
    .join(', ');

  const techniques = alert.tags?.split(',')
    .filter(tag => tag.toLowerCase().includes('t1'))
    .map(tag => tag.trim().toUpperCase());

  return (
    <div className="h-full bg-black/90 border-l border-blue-500/10">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-blue-500/10 bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Alert Details
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-blue-400" />
        </button>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-4rem)] overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Primary Alert Info */}
          <Card className="bg-purple-950/20 border-purple-500/10 p-4">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Alert Overview</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-purple-400">Title</h4>
                <p className="text-lg text-purple-100">{alert.title || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-400">Description</h4>
                <p className="text-sm text-purple-200/90">{alert.description || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-purple-400">Severity</h4>
                  <p className="text-sm text-purple-100">{alert.rule_level || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-purple-400">Rule ID</h4>
                  <p className="text-sm text-purple-100 font-mono">{alert.ruleid || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-purple-400">Task</h4>
                  <p className="text-sm text-purple-100">{alert.task || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* MITRE ATT&CK Info */}
          <Card className="bg-blue-950/20 border-blue-500/10 p-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">MITRE ATT&CK</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-blue-400">Tactics</h4>
                <p className="text-sm text-blue-100">{tactics || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-400">Techniques</h4>
                <div className="flex flex-wrap gap-2">
                  {techniques?.map((technique, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* System Details */}
          <Card className="bg-green-950/20 border-green-500/10 p-4">
            <h3 className="text-lg font-semibold text-green-300 mb-3">System Information</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <h4 className="text-sm font-medium text-green-400">Computer Name</h4>
                <p className="text-sm text-green-100 font-mono">{alert.computer_name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-400">IP Address</h4>
                <p className="text-sm text-green-100 font-mono">{alert.ip_address || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-400">User ID</h4>
                <p className="text-sm text-green-100 font-mono">{alert.user_id || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-400">Event ID</h4>
                <p className="text-sm text-green-100 font-mono">{alert.event_id || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-400">Provider</h4>
                <p className="text-sm text-green-100 font-mono">{alert.provider_name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-400">Target User</h4>
                <p className="text-sm text-green-100 font-mono">{alert.target_user_name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-400">Target Domain</h4>
                <p className="text-sm text-green-100 font-mono">{alert.target_domain_name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-400">System Time</h4>
                <p className="text-sm text-green-100 font-mono">{browserTime || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Raw Log Section */}
          <Card className="bg-gray-950/20 border-gray-500/10">
            <TimelineRawLog alert={alert} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;
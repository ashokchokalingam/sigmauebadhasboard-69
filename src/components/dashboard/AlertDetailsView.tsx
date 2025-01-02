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
    .map(tactic => tactic.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '));

  const techniques = alert.tags?.split(',')
    .filter(tag => tag.toLowerCase().includes('t1'))
    .map(tag => tag.trim().toUpperCase());

  const getSeverityColor = (level: string = '') => {
    const l = level.toLowerCase();
    if (l.includes('critical')) return 'text-[#FF4500]';
    if (l.includes('high')) return 'text-[#FF8C00]';
    if (l.includes('medium')) return 'text-[#FFD700]';
    if (l.includes('low')) return 'text-[#32CD32]';
    return 'text-[#1E90FF]';
  };

  return (
    <div className="h-full bg-[#1E1E2F] border-l border-[#7B68EE]/20">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#7B68EE]/20 bg-[#1E1E2F] backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
          Alert Details
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#2B2B3B] rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-[#A9A9A9]" />
        </button>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-4rem)] overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Primary Alert Info */}
          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
            <h3 className="text-lg font-semibold text-[#E0E0E0] mb-3">Alert Overview</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Title</h4>
                <p className="text-lg text-white">{alert.title || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Description</h4>
                <p className="text-sm text-[#E0E0E0]">{alert.description || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Severity</h4>
                  <p className={`text-sm ${getSeverityColor(alert.rule_level)}`}>
                    {alert.rule_level || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Rule ID</h4>
                  <p className="text-sm text-[#1E90FF] font-mono">{alert.ruleid || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#A9A9A9]">Task</h4>
                  <p className="text-sm text-white">{alert.task || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* MITRE ATT&CK Info */}
          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
            <h3 className="text-lg font-semibold text-[#7B68EE] mb-3">MITRE ATT&CK</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Tactics</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tactics?.map((tactic, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-[#7B68EE]/10 text-[#7B68EE] text-xs rounded-full border border-[#7B68EE]/20"
                    >
                      {tactic}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Techniques</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {techniques?.map((technique, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-[#7B68EE]/10 text-[#7B68EE] text-xs rounded-full border border-[#7B68EE]/20"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* System Details */}
          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20 p-4">
            <h3 className="text-lg font-semibold text-[#E0E0E0] mb-3">System Information</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Computer Name</h4>
                <p className="text-sm text-[#E0E0E0] font-mono">{alert.computer_name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">IP Address</h4>
                <p className="text-sm text-[#E0E0E0] font-mono">{alert.ip_address || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">User ID</h4>
                <p className="text-sm text-[#E0E0E0] font-mono">{alert.user_id || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Event ID</h4>
                <p className="text-sm text-[#1E90FF] font-mono">{alert.event_id || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Provider</h4>
                <p className="text-sm text-[#E0E0E0] font-mono">{alert.provider_name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Target User</h4>
                <p className="text-sm text-[#1E90FF] font-mono">{alert.target_user_name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">Target Domain</h4>
                <p className="text-sm text-[#E0E0E0] font-mono">{alert.target_domain_name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#A9A9A9]">System Time</h4>
                <p className="text-sm text-[#E0E0E0] font-mono">{browserTime || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Raw Log Section */}
          <Card className="bg-[#2B2B3B] border-[#7B68EE]/20">
            <TimelineRawLog alert={alert} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;
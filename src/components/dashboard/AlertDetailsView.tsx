import { Alert } from "./types";
import { X, FileText, Target, Shield, Hash, Terminal, Clock, Computer, User, Network, AlertTriangle, Globe, Database, Tag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimelineRawLog from "./TimelineRawLog";

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

  // Extract MITRE ATT&CK information
  const tactics = alert.tags?.split(',')
    .filter(tag => tag.includes('attack.'))
    .map(tag => tag.replace('attack.', ''))
    .join(', ');

  const techniques = alert.tags?.split(',')
    .filter(tag => tag.toLowerCase().includes('t1'))
    .map(tag => tag.trim().toUpperCase());

  return (
    <div className="bg-black/90 border border-blue-500/10 shadow-2xl flex flex-col rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-blue-500/10 bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
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
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Primary Alert Details Section */}
          <div className="space-y-4 border-b border-blue-500/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-blue-100">Title</h3>
              </div>
              <p className="text-blue-200 pl-7">{alert.title || 'N/A'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-medium text-yellow-100">Description</h3>
              </div>
              <p className="text-blue-200 pl-7">{alert.description || 'N/A'}</p>
            </div>

            {/* MITRE ATT&CK Information */}
            <div className="space-y-2 pl-7 pt-2">
              <h4 className="text-sm font-medium text-purple-400">MITRE ATT&CK:</h4>
              
              <div className="space-y-2">
                <div>
                  <h5 className="text-sm text-purple-300">Tactics:</h5>
                  <p className="text-purple-200">{tactics || 'N/A'}</p>
                </div>
                
                <div>
                  <h5 className="text-sm text-purple-300">Techniques:</h5>
                  <div className="flex flex-wrap gap-2">
                    {techniques?.map((technique, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full border border-purple-500/20"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 pl-7">
              <h4 className="text-sm font-medium text-blue-400">Rule ID:</h4>
              <p className="text-blue-200 font-mono">{alert.ruleid || 'N/A'}</p>
            </div>
          </div>

          {/* Severity & Task Section */}
          <div className="space-y-4 border-b border-blue-500/10 pb-6">
            <h3 className="text-lg font-medium text-blue-100">Severity & Task</h3>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400">Severity</span>
                </div>
                <p className="text-blue-200 capitalize">{alert.rule_level || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400">Task</span>
                </div>
                <p className="text-blue-200">{alert.task || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400">ML Cluster</span>
                </div>
                <p className="text-blue-200">Cluster {alert.dbscan_cluster || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* System Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-100">System Information</h3>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Computer className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400">Computer Name</span>
                </div>
                <p className="text-blue-200">{alert.computer_name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400">IP Address</span>
                </div>
                <p className="text-blue-200 font-mono">{alert.ip_address || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400">Event ID</span>
                </div>
                <p className="text-blue-200">{alert.event_id || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400">Provider</span>
                </div>
                <p className="text-blue-200">{alert.provider_name || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlertDetailsView;
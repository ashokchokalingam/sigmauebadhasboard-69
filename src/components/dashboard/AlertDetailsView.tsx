import { Alert } from "./types";
import { X, FileText, Target, Shield, Hash, Terminal, Clock, Computer, User, Network, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimelineRawLog from "./TimelineRawLog";

interface AlertDetailsViewProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  const getIconForField = (key: string) => {
    switch (key) {
      case "title": return <FileText className="h-5 w-5 text-blue-400" />;
      case "description": return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "tags": return <Target className="h-5 w-5 text-purple-400" />;
      case "system_time": return <Clock className="h-5 w-5 text-green-400" />;
      case "computer_name": return <Computer className="h-5 w-5 text-cyan-400" />;
      case "user_id": return <User className="h-5 w-5 text-indigo-400" />;
      case "ip_address": return <Network className="h-5 w-5 text-pink-400" />;
      case "ruleid": return <Hash className="h-5 w-5 text-orange-400" />;
      default: return <Shield className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <div 
      className="fixed right-0 w-[600px] bg-black/90 border-l border-blue-500/10 shadow-2xl flex flex-col overflow-hidden"
      style={{
        height: 'min(100vh, 800px)',
        top: 'max(0px, calc(var(--scroll-offset, 0px)))',
        transition: 'top 0.3s ease-out'
      }}
    >
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

      {/* Scrollable Content Area */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Title Section */}
          <div className="space-y-2 border-b border-blue-500/10 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-blue-100">{alert.title}</h3>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2 border-b border-blue-500/10 pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              <h4 className="text-lg font-medium text-yellow-100">Description</h4>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed pl-8">
              {alert.description || 'No description available'}
            </p>
          </div>

          {/* MITRE ATT&CK Section */}
          <div className="space-y-4 border-b border-blue-500/10 pb-4">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-400" />
              <h4 className="text-lg font-medium text-purple-100">MITRE ATT&CK</h4>
            </div>
            <div className="pl-8 space-y-4">
              <div className="flex flex-wrap gap-2">
                {alert.tags?.split(',').map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full border border-purple-500/20"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {['ruleid', 'system_time', 'computer_name', 'user_id', 'ip_address'].map((key) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  {getIconForField(key)}
                  <h4 className="text-sm font-medium text-blue-300">{key.replace('_', ' ').toUpperCase()}</h4>
                </div>
                <p className="text-blue-100 pl-7">
                  {alert[key as keyof Alert]?.toString() || 'N/A'}
                </p>
              </div>
            ))}
          </div>

          {/* Raw Data Section */}
          <div className="mt-6 border-t border-blue-500/10 pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-6 w-6 text-green-400" />
              <span className="text-lg font-semibold text-green-100">Raw Data</span>
            </div>
            <TimelineRawLog alert={alert} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlertDetailsView;
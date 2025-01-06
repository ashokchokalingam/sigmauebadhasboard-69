import { Info, Monitor, User, Hash, Terminal, Shield, Server, Calendar, Clock } from "lucide-react";
import { Alert } from "../types";

interface DetailMetadataProps {
  alert: Alert;
  formatTime: (timeString: string) => string;
}

const DetailMetadata = ({ alert, formatTime }: DetailMetadataProps) => {
  return (
    <>
      <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-medium text-purple-200">Description</h3>
        </div>
        <p className="text-sm text-purple-100/90 leading-relaxed">
          {alert.description || 'No description available'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-400/5 p-3 rounded-lg border border-purple-400/20">
          <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-1">
            <Monitor className="h-4 w-4" /> Computer
          </h4>
          <p className="text-sm text-blue-100 font-mono">{alert.computer_name || 'N/A'}</p>
        </div>
        <div className="bg-purple-400/5 p-3 rounded-lg border border-purple-400/20">
          <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-1">
            <User className="h-4 w-4" /> User ID
          </h4>
          <p className="text-sm text-blue-100 font-mono">{alert.user_id || 'N/A'}</p>
        </div>
        <div className="bg-purple-400/5 p-3 rounded-lg border border-purple-400/20">
          <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-1">
            <Hash className="h-4 w-4" /> Event ID
          </h4>
          <p className="text-sm text-blue-100 font-mono">{alert.event_id || 'N/A'}</p>
        </div>
        <div className="bg-purple-400/5 p-3 rounded-lg border border-purple-400/20">
          <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-1">
            <Terminal className="h-4 w-4" /> Provider
          </h4>
          <p className="text-sm text-blue-100 font-mono">{alert.provider_name || 'N/A'}</p>
        </div>
        <div className="bg-purple-400/5 p-3 rounded-lg border border-purple-400/20">
          <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4" /> Rule ID
          </h4>
          <p className="text-sm text-blue-100 font-mono">{alert.ruleid || 'N/A'}</p>
        </div>
        <div className="bg-purple-400/5 p-3 rounded-lg border border-purple-400/20">
          <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-1">
            <Server className="h-4 w-4" /> Rule Level
          </h4>
          <p className="text-sm text-blue-100 font-mono capitalize">{alert.rule_level || 'N/A'}</p>
        </div>
        <div className="bg-purple-400/5 p-3 rounded-lg border border-purple-400/20">
          <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4" /> System Time
          </h4>
          <p className="text-sm text-blue-100 font-mono">{formatTime(alert.system_time)}</p>
        </div>
        <div className="bg-purple-400/5 p-3 rounded-lg border border-purple-400/20">
          <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4" /> Task
          </h4>
          <p className="text-sm text-blue-100 font-mono">{alert.task || 'N/A'}</p>
        </div>
      </div>
    </>
  );
};

export default DetailMetadata;
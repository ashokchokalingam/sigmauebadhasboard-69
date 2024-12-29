import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, X } from "lucide-react";
import { Alert } from "./types";

interface AlertDetailsPanelProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsPanel = ({ alert, onClose }: AlertDetailsPanelProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  
  return (
    <Card className="w-[600px] bg-black/40 border-blue-500/10 h-fit sticky top-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-blue-100 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-blue-500" />
          Alert Details
        </CardTitle>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-blue-400" />
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Overview Section */}
        <div>
          <h4 className="text-sm font-medium text-blue-400 mb-2">Alert Overview</h4>
          <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
            <h3 className="text-lg font-semibold text-blue-100 mb-2">{alert.title}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
                {tactics || 'No Tactics'}
              </span>
              <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20">
                {techniques || 'No Techniques'}
              </span>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                Rule ID: {alert.ruleid}
              </span>
            </div>
          </div>
        </div>

        {/* Entity Information */}
        <div>
          <h4 className="text-sm font-medium text-blue-400 mb-2">Entity Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
              <p className="text-sm font-medium text-blue-400 mb-1">Computer Name</p>
              <p className="text-blue-100 font-mono">{alert.computer_name}</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
              <p className="text-sm font-medium text-blue-400 mb-1">User ID</p>
              <p className="text-blue-100 font-mono">{alert.user_id}</p>
            </div>
            {alert.ip_address && (
              <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
                <p className="text-sm font-medium text-blue-400 mb-1">IP Address</p>
                <p className="text-blue-100 font-mono">{alert.ip_address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div>
          <h4 className="text-sm font-medium text-blue-400 mb-2">Event Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
              <p className="text-sm font-medium text-blue-400 mb-1">Event ID</p>
              <p className="text-blue-100 font-mono">{alert.event_id}</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
              <p className="text-sm font-medium text-blue-400 mb-1">Provider Name</p>
              <p className="text-blue-100">{alert.provider_name}</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
              <p className="text-sm font-medium text-blue-400 mb-1">Task</p>
              <p className="text-blue-100">{alert.task}</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
              <p className="text-sm font-medium text-blue-400 mb-1">System Time</p>
              <p className="text-blue-100 font-mono">
                {new Date(alert.system_time).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Raw Data Section */}
        <div>
          <h4 className="text-sm font-medium text-blue-400 mb-2">Raw Event Data</h4>
          <pre className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10 overflow-x-auto">
            <code className="text-sm font-mono text-blue-100">
              {JSON.stringify(JSON.parse(alert.raw), null, 2)}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertDetailsPanel;
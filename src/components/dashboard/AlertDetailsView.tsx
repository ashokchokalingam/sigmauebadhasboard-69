import { Card, CardContent } from "@/components/ui/card";
import AlertDetailsHeader from "./AlertDetailsHeader";
import { Alert } from "./types";

interface AlertDetailsViewProps {
  alert: Alert;
}

const AlertDetailsView = ({ alert }: AlertDetailsViewProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  
  return (
    <div className="space-y-6">
      <AlertDetailsHeader 
        title={alert.title}
        ruleId={alert.ruleid}
        severity={alert.rule_level}
      />

      {/* User & System Info Section */}
      <div className="space-y-4 bg-blue-950/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-300">User & System Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-blue-400">Username</p>
            <p className="text-base text-blue-100 font-mono">{alert.user_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-400">Computer Name</p>
            <p className="text-base text-blue-100 font-mono">{alert.computer_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-400">IP Address</p>
            <p className="text-base text-blue-100 font-mono">{alert.ip_address || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-400">Time</p>
            <p className="text-base text-blue-100 font-mono">
              {new Date(alert.system_time).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK Section */}
      <div className="space-y-4 bg-green-950/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-300">MITRE ATT&CK</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-green-400">Tactics</p>
            <p className="text-base text-green-100">{tactics || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Techniques</p>
            <p className="text-base text-green-100">{techniques || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="space-y-4 bg-blue-950/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-300">Event Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-blue-400">Event ID</p>
            <p className="text-base text-blue-100">{alert.event_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-400">Task</p>
            <p className="text-base text-blue-100">{alert.task}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-400">Provider Name</p>
            <p className="text-base text-blue-100">{alert.provider_name}</p>
          </div>
        </div>
      </div>

      {/* Raw Data Section */}
      <div className="space-y-4 bg-gray-950/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-300">Raw Data</h3>
        <pre className="text-sm text-gray-100 font-mono bg-black/40 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(JSON.parse(alert.raw), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AlertDetailsView;
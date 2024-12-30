import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";
import AlertDetailsHeader from "./AlertDetailsHeader";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";

interface AlertDetailsViewProps {
  alert: Alert;
}

const AlertDetailsView = ({ alert }: AlertDetailsViewProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [alert.raw]);
  
  return (
    <div className="space-y-3 text-sm">
      <AlertDetailsHeader 
        title={alert.title}
        ruleId={alert.ruleid}
        severity={alert.rule_level}
      />

      {/* User & System Info Section */}
      <div className="space-y-2 bg-blue-950/20 p-3 rounded-lg">
        <h3 className="text-base font-semibold text-blue-300">User & System Information</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-medium text-blue-400">Username</p>
            <p className="text-sm text-blue-100 font-mono">{alert.user_id}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-400">Computer Name</p>
            <p className="text-sm text-blue-100 font-mono">{alert.computer_name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-400">IP Address</p>
            <p className="text-sm text-blue-100 font-mono">{alert.ip_address || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-400">Time</p>
            <p className="text-sm text-blue-100 font-mono">
              {new Date(alert.system_time).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK Section */}
      <div className="space-y-2 bg-green-950/20 p-3 rounded-lg">
        <h3 className="text-base font-semibold text-green-300">MITRE ATT&CK</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-medium text-green-400">Tactics</p>
            <p className="text-sm text-green-100">{tactics || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-green-400">Techniques</p>
            <div className="flex flex-wrap gap-1">
              {techniques.length > 0 ? (
                techniques.map((technique, index) => (
                  <span 
                    key={index}
                    className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-lg border border-green-500/20"
                  >
                    {technique}
                  </span>
                ))
              ) : (
                <span className="text-green-100">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="space-y-2 bg-blue-950/20 p-3 rounded-lg">
        <h3 className="text-base font-semibold text-blue-300">Event Details</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-medium text-blue-400">Event ID</p>
            <p className="text-sm text-blue-100">{alert.event_id}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-400">Rule ID</p>
            <p className="text-sm text-blue-100">{alert.ruleid}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-400">Severity</p>
            <p className="text-sm text-blue-100 capitalize">{alert.rule_level}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-400">Task</p>
            <p className="text-sm text-blue-100">{alert.task || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-400">Provider Name</p>
            <p className="text-sm text-blue-100">{alert.provider_name}</p>
          </div>
        </div>
      </div>

      {/* Raw Data Section */}
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-300">Raw Data</h3>
        <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
          <pre className="p-3 overflow-x-auto text-xs scrollbar-thin scrollbar-thumb-gray-500/20 scrollbar-track-transparent">
            <code ref={codeRef} className="language-json">
              {JSON.stringify(JSON.parse(alert.raw), null, 2)}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsView;
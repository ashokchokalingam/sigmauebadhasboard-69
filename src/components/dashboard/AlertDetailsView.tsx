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
            <div className="flex flex-col gap-2">
              {techniques.length > 0 ? (
                techniques.map((technique, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-green-500/10 text-green-400 text-sm rounded-lg border border-green-500/20 w-fit"
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300">Raw Data</h3>
        <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
          <pre className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500/20 scrollbar-track-transparent">
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
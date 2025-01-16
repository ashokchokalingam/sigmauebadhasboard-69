import { Alert } from "../types";
import { Shield, Monitor, User, Hash, Database, Tag, Terminal, Info } from "lucide-react";
import { motion } from "framer-motion";

interface LogDetailsProps {
  log: Alert;
}

const LogDetails = ({ log }: LogDetailsProps) => {
  const parseRawData = (rawData: string | object | null): Record<string, any> | null => {
    if (!rawData) return null;
    try {
      if (typeof rawData === 'string') {
        return JSON.parse(rawData);
      }
      return rawData as Record<string, any>;
    } catch (e) {
      console.error('Error parsing raw data:', e);
      return null;
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="ml-12 mt-2 mb-4"
    >
      <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5 rounded-lg border border-purple-500/20">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
              <User className="h-4 w-4" /> User Information
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-purple-300">User ID:</div>
              <div className="text-purple-100 font-mono">{log.user_id || 'N/A'}</div>
              <div className="text-purple-300">Target User:</div>
              <div className="text-purple-100 font-mono">{log.target_user_name || 'N/A'}</div>
              <div className="text-purple-300">Target Domain:</div>
              <div className="text-purple-100 font-mono">{log.target_domain_name || 'N/A'}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Security Details
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-purple-300">Event ID:</div>
              <div className="text-purple-100 font-mono">{log.event_id || 'N/A'}</div>
              <div className="text-purple-300">Risk Score:</div>
              <div className="text-purple-100 font-mono">{log.risk || 'N/A'}</div>
              <div className="text-purple-300">Rule ID:</div>
              <div className="text-purple-100 font-mono">{log.ruleid || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
              <Terminal className="h-4 w-4" /> System Information
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-purple-300">Computer:</div>
              <div className="text-purple-100 font-mono">{log.computer_name || 'N/A'}</div>
              <div className="text-purple-300">IP Address:</div>
              <div className="text-purple-100 font-mono">{log.ip_address || 'N/A'}</div>
              <div className="text-purple-300">Provider:</div>
              <div className="text-purple-100 font-mono">{log.provider_name || 'N/A'}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" /> MITRE ATT&CK
            </h3>
            <div className="flex flex-wrap gap-2">
              {log.tactics?.split(',').map((tactic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                >
                  {tactic.trim()}
                </span>
              ))}
              {log.techniques?.split(',').map((technique, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
                >
                  {technique.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
            <Database className="h-4 w-4" /> Raw Event Data
          </h3>
          <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-purple-100/90 whitespace-pre-wrap">
              {JSON.stringify(parseRawData(log.raw), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LogDetails;
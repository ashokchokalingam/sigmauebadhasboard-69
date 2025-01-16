import { Alert } from "../types";
import { Card } from "../../ui/card";
import { ScrollArea } from "../../ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Monitor, User, Hash, Database, Tag, Terminal, Info, ChevronDown,
  AlertCircle, Clock, Target, Server, Activity, Brain, ShieldAlert, Tags
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogDetailsProps {
  log: Alert;
}

const LogDetails = ({ log }: LogDetailsProps) => {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  const handleRawLogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRawExpanded(!isRawExpanded);
  };

  const formatJson = (data: any) => {
    if (typeof data === 'string') {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  const renderMetadata = () => (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 mb-2">
            <Monitor className="h-4 w-4" /> System Information
          </h4>
          <div className="space-y-2">
            <p className="text-sm text-purple-100 font-mono flex justify-between">
              <span className="text-purple-400">Computer:</span> {log.computer_name || 'N/A'}
            </p>
            <p className="text-sm text-purple-100 font-mono flex justify-between">
              <span className="text-purple-400">IP:</span> {log.ip_address || 'N/A'}
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 mb-2">
            <User className="h-4 w-4" /> User Details
          </h4>
          <div className="space-y-2">
            <p className="text-sm text-purple-100 font-mono flex justify-between">
              <span className="text-purple-400">User ID:</span> {log.user_id || 'N/A'}
            </p>
            <p className="text-sm text-purple-100 font-mono flex justify-between">
              <span className="text-purple-400">Target User:</span> {log.target_user_name || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4" /> Security Details
          </h4>
          <div className="space-y-2">
            <p className="text-sm text-purple-100 font-mono flex justify-between">
              <span className="text-purple-400">Event ID:</span> {log.event_id || 'N/A'}
            </p>
            <p className="text-sm text-purple-100 font-mono flex justify-between">
              <span className="text-purple-400">Rule ID:</span> {log.ruleid || 'N/A'}
            </p>
            <p className="text-sm text-purple-100 font-mono flex justify-between">
              <span className="text-purple-400">Level:</span> {log.rule_level || 'N/A'}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4" /> ML Analysis
          </h4>
          <div className="space-y-2">
            <p className="text-sm text-purple-100 font-mono flex justify-between">
              <span className="text-purple-400">ML Cluster:</span> {log.ml_cluster || 'N/A'}
            </p>
            <p className="text-sm text-purple-100 font-mono">
              <span className="text-purple-400">ML Description:</span>
              <span className="block mt-1 text-purple-200">{log.ml_description || 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4" /> MITRE ATT&CK
          </h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-purple-400">Tactics:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {log.tactics?.split(',').map((tactic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                  >
                    {tactic.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-purple-400">Techniques:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {log.techniques?.split(',').map((technique, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
                  >
                    {technique.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2 mb-2">
            <Tags className="h-4 w-4" /> Additional Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {log.tags?.split(',').map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Card className="bg-purple-950/20 border-purple-500/20">
        <ScrollArea className="h-full max-h-[800px]">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-100 mb-2">Description</h3>
              <p className="text-sm text-purple-300/90 leading-relaxed font-medium">
                {log.description}
              </p>
            </div>

            {renderMetadata()}

            <div>
              <button
                onClick={handleRawLogClick}
                className="flex items-center gap-2 text-sm font-medium text-purple-200 mb-2 hover:text-purple-100 transition-colors"
              >
                <motion.div
                  animate={{ rotate: isRawExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
                Raw Log
              </button>
              <AnimatePresence>
                {isRawExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="relative">
                      <pre className="text-sm font-mono bg-purple-950/30 p-4 rounded-lg overflow-x-auto border border-purple-500/20">
                        <code className="text-purple-100">
                          {formatJson(log.raw)}
                        </code>
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
};

export default LogDetails;
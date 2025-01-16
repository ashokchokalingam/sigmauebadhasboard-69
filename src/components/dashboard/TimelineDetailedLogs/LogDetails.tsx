import { Alert } from "../types";
import { Card } from "../../ui/card";
import { ScrollArea } from "../../ui/scroll-area";
import { motion } from "framer-motion";
import { Shield, Monitor, User, Hash, Database, Tag, Terminal, Info, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogDetailsProps {
  log: Alert;
}

const LogDetails = ({ log }: LogDetailsProps) => {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  const renderMetadata = () => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <h4 className="text-sm font-medium text-purple-400 flex items-center gap-2">
          <Monitor className="h-4 w-4" /> Computer
        </h4>
        <p className="text-sm text-purple-100 font-mono">{log.computer_name || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-purple-400 flex items-center gap-2">
          <User className="h-4 w-4" /> User
        </h4>
        <p className="text-sm text-purple-100 font-mono">{log.user_id || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-purple-400 flex items-center gap-2">
          <Hash className="h-4 w-4" /> Event ID
        </h4>
        <p className="text-sm text-purple-100 font-mono">{log.event_id || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-purple-400 flex items-center gap-2">
          <Shield className="h-4 w-4" /> Rule ID
        </h4>
        <p className="text-sm text-purple-100 font-mono">{log.ruleid || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-purple-400 flex items-center gap-2">
          <Terminal className="h-4 w-4" /> Provider
        </h4>
        <p className="text-sm text-purple-100 font-mono">{log.provider_name || 'N/A'}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-purple-400 flex items-center gap-2">
          <Info className="h-4 w-4" /> Task
        </h4>
        <p className="text-sm text-purple-100 font-mono">{log.task || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-2"
    >
      <Card className="bg-purple-950/20 border-purple-500/20">
        <ScrollArea className="h-full max-h-[600px]">
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-purple-200 mb-2">Description</h4>
              <p className="text-sm text-purple-300/70">{log.description}</p>
            </div>

            {renderMetadata()}

            {log.tags && (
              <div>
                <h4 className="text-sm font-medium text-purple-200 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {log.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <button
                onClick={() => setIsRawExpanded(!isRawExpanded)}
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
                    <pre className="text-xs text-purple-300/70 bg-black/20 p-4 rounded-lg overflow-x-auto font-mono">
                      {typeof log.raw === 'string' 
                        ? JSON.stringify(JSON.parse(log.raw), null, 2)
                        : JSON.stringify(log.raw, null, 2)}
                    </pre>
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
import { Alert } from "../types";
import { Card } from "../../ui/card";
import { ScrollArea } from "../../ui/scroll-area";
import { motion } from "framer-motion";
import { extractTacticsAndTechniques } from "../utils";

interface LogDetailsProps {
  log: Alert;
}

const LogDetails = ({ log }: LogDetailsProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(log.tags || '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-2"
    >
      <Card className="bg-purple-950/20 border-purple-500/20">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-purple-200 mb-2">Description</h4>
              <p className="text-sm text-purple-300/70">{log.description}</p>
            </div>

            {tactics && (
              <div>
                <h4 className="text-sm font-medium text-purple-200 mb-2">MITRE ATT&CK Tactics</h4>
                <p className="text-sm text-purple-300/70">{tactics}</p>
              </div>
            )}

            {techniques.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-purple-200 mb-2">MITRE ATT&CK Techniques</h4>
                <div className="flex flex-wrap gap-2">
                  {techniques.map((technique, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-purple-200 mb-2">Raw Log</h4>
              <pre className="text-xs text-purple-300/70 bg-black/20 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(log.raw, null, 2)}
              </pre>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
};

export default LogDetails;
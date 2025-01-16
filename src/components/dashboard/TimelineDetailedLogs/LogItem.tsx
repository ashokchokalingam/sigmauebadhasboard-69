import { useState } from "react";
import { Alert } from "../types";
import { ChevronRight, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import LogDetails from "./LogDetails";

interface LogItemProps {
  log: Alert;
}

const LogItem = ({ log }: LogItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (level: string = "") => {
    const l = level.toLowerCase();
    if (l.includes("critical")) return "text-red-400 bg-red-950/30";
    if (l.includes("high")) return "text-orange-400 bg-orange-950/30";
    if (l.includes("medium")) return "text-yellow-400 bg-yellow-950/30";
    if (l.includes("low")) return "text-green-400 bg-green-950/30";
    return "text-blue-400 bg-blue-950/30";
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer",
          "hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20",
          isExpanded && "bg-purple-500/10 border-purple-500/20"
        )}
      >
        <ChevronRight 
          className={cn(
            "h-4 w-4 text-purple-300 transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        />
        
        <div className="flex items-center min-w-[120px] text-purple-300">
          <Clock className="h-4 w-4 mr-2" />
          <span className="font-mono text-sm">
            {format(new Date(log.system_time), "HH:mm:ss")}
          </span>
        </div>

        <div className="flex items-center space-x-2 min-w-[180px]">
          <AlertCircle className={cn("h-4 w-4", getSeverityColor(log.rule_level))} />
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            getSeverityColor(log.rule_level)
          )}>
            {log.rule_level}
          </span>
        </div>

        <div className="flex-1">
          <div className="text-purple-100 font-medium">{log.title}</div>
          <div className="text-sm text-purple-300/70 line-clamp-1">
            {log.description}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LogDetails log={log} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LogItem;
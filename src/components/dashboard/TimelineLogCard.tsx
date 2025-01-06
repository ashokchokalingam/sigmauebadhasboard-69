import { Alert } from "./types";
import { format, parseISO } from "date-fns";
import {
  ChevronRight,
  User,
  Monitor,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "../ui/table";

interface TimelineLogCardProps {
  log: Alert;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

const TimelineLogCard = ({ log, isExpanded, onToggleExpand }: TimelineLogCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  // Split tags into tactics and techniques
  const tags = log.tags.split(",").map(tag => tag.trim());
  const tactics = tags.filter(tag => tag.startsWith("attack.") && !tag.includes("t1"));
  const techniques = tags.filter(tag => tag.includes("t1"));

  return (
    <TableRow 
      className={cn(
        "hover:bg-blue-950/30 cursor-pointer transition-colors",
        isExpanded && "bg-blue-950/20"
      )}
      onClick={() => onToggleExpand(log.id)}
    >
      {/* Time Column */}
      <TableCell className="font-mono text-sm text-blue-300">
        {formatDate(log.system_time)}
      </TableCell>

      {/* Users Column */}
      <TableCell>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-sm text-blue-100">{log.user_id || 'N/A'}</span>
          </div>
          {log.target_user_name && (
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-sm text-blue-100">{log.target_user_name}</span>
            </div>
          )}
        </div>
      </TableCell>

      {/* Computer Column */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Monitor className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-sm text-blue-100">{log.computer_name}</span>
        </div>
      </TableCell>

      {/* Event Column */}
      <TableCell>
        <div className="space-y-1">
          <div className="text-sm font-medium text-blue-100">{log.title}</div>
          <div className="text-xs text-blue-300/70 line-clamp-2">{log.description}</div>
        </div>
      </TableCell>

      {/* Tactics & Techniques Column */}
      <TableCell>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {tactics.map((tactic, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 text-[10px] bg-blue-500/10 rounded-full text-blue-300"
              >
                {tactic.replace('attack.', '')}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 text-xs bg-blue-500/20 rounded-md text-blue-300 font-medium"
              >
                {technique.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </TableCell>

      {/* Expand Button Column */}
      <TableCell>
        <ChevronRight 
          className={cn(
            "h-4 w-4 text-blue-400 transition-transform duration-200",
            isExpanded && "transform rotate-90"
          )} 
        />
      </TableCell>
    </TableRow>
  );
};

export default TimelineLogCard;
import { Alert } from "./types";
import { format, parseISO } from "date-fns";
import {
  ChevronRight,
  User,
  Monitor,
  Target,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "../ui/table";

interface TimelineLogCardProps {
  log: Alert;
  isExpanded: boolean;
  onToggleExpand: (log: Alert) => void;
}

const TimelineLogCard = ({ log, isExpanded, onToggleExpand }: TimelineLogCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  const tags = log.tags.split(",").map(tag => tag.trim());
  const tactics = tags.filter(tag => tag.startsWith("attack.") && !tag.includes("t1"));
  const techniques = tags.filter(tag => tag.includes("t1"));

  return (
    <TableRow 
      className={cn(
        "hover:bg-[#1E1E2F] cursor-pointer transition-colors",
        isExpanded && "bg-[#1E1E2F]"
      )}
    >
      <TableCell className="font-mono text-sm text-gray-300">
        {formatDate(log.system_time)}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-sm text-gray-200">{log.user_id || 'N/A'}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-sm text-gray-200">{log.target_user_name || 'N/A'}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Monitor className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-sm text-gray-200">{log.computer_name}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-200">{log.title}</div>
          <div className="text-xs text-gray-400 line-clamp-2">{log.description}</div>
        </div>
      </TableCell>

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

      <TableCell>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(log);
          }}
          className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
        >
          <ChevronRight 
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isExpanded && "transform rotate-90"
            )} 
          />
        </button>
      </TableCell>
    </TableRow>
  );
};

export default TimelineLogCard;
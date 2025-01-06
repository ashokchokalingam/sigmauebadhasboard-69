import { Alert } from "./types";
import { format, parseISO } from "date-fns";
import {
  Clock,
  Hash,
  Monitor,
  User,
  Shield,
  Network,
  ChevronRight,
  Terminal,
  FileText,
  Activity,
  Info,
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
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm:ss zzz');
    } catch (error) {
      return dateString;
    }
  };

  // Split tags into tactics and techniques
  const tags = log.tags.split(",").map(tag => tag.trim());
  const tactics = tags.filter(tag => tag.startsWith("attack.") && !tag.includes("t1"));
  const techniques = tags.filter(tag => tag.includes("t1"));

  return (
    <div className="relative">
      <TableRow 
        className={cn(
          "hover:bg-blue-950/30 cursor-pointer transition-colors",
          isExpanded && "bg-blue-950/20"
        )}
        onClick={() => onToggleExpand(log.id)}
      >
        <TableCell className="font-mono text-blue-300 text-sm whitespace-nowrap">
          {formatDate(log.system_time)}
        </TableCell>
        
        <TableCell>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <span className="text-blue-100">{log.user_id || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-blue-100">{log.target_user_name || 'N/A'}</span>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-blue-400" />
            <span className="text-blue-100">{log.computer_name}</span>
          </div>
        </TableCell>

        <TableCell>
          <div className="space-y-2">
            <span className="text-blue-100 font-medium">{log.title}</span>
            <p className="text-sm text-blue-300/70 line-clamp-2">{log.description}</p>
          </div>
        </TableCell>

        <TableCell>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {tactics.map((tactic, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-0.5 bg-blue-500/10 rounded-full text-blue-300"
                >
                  {tactic.replace('attack.', '')}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {techniques.map((technique, index) => (
                <span 
                  key={index} 
                  className="text-sm px-3 py-1 bg-blue-500/10 rounded-md text-blue-300 font-medium hover:bg-blue-500/20 transition-colors"
                >
                  {technique.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </TableCell>

        <TableCell className="w-[50px]">
          <button 
            className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(log.id);
            }}
          >
            <ChevronRight 
              className={cn(
                "h-4 w-4 text-blue-400 transition-transform duration-200",
                isExpanded && "transform rotate-90"
              )} 
            />
          </button>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="bg-black/40">
          <TableCell colSpan={6} className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">Provider: </span>
                  <span className="text-sm text-blue-100">{log.provider_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">IP Address: </span>
                  <span className="text-sm text-blue-100">{log.ip_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">Rule Level: </span>
                  <span className="text-sm text-blue-100">{log.rule_level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">Event ID: </span>
                  <span className="text-sm text-blue-100">{log.event_id}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Terminal className="h-4 w-4" />
                  <span className="text-sm">Raw Data</span>
                </div>
                <pre className="p-4 bg-black/60 rounded-lg border border-blue-500/10 text-xs text-blue-100 font-mono whitespace-pre-wrap overflow-x-auto">
                  {typeof log.raw === 'string'
                    ? JSON.stringify(JSON.parse(log.raw), null, 2)
                    : JSON.stringify(log.raw, null, 2)}
                </pre>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </div>
  );
};

export default TimelineLogCard;
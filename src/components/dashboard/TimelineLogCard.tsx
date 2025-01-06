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
    <div className="relative pl-4 py-2">
      <div className="absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2 border-blue-400 bg-background" />
      <div className="absolute left-0 top-8 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-blue-400/50 to-transparent" />

      <div className="ml-4">
        <div className="p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/50 transition-all duration-300">
          {/* Top Row: Timestamp, Event ID, and Tactics */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-blue-300">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{formatDate(log.system_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-mono">Event ID: {log.event_id}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <div className="flex flex-wrap gap-1">
                {tactics.map((tactic, index) => (
                  <span key={index} className="text-xs px-2 py-0.5 bg-blue-500/10 rounded-full text-blue-300">
                    {tactic.replace('attack.', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-medium text-blue-100 capitalize">{log.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <p className="text-sm text-blue-300">{log.description}</p>
            </div>
          </div>

          {/* Techniques Section with larger font */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {techniques.map((technique, index) => (
                <span key={index} className="text-base px-4 py-1.5 bg-blue-500/10 rounded-md text-blue-300 font-medium hover:bg-blue-500/20 transition-colors">
                  {technique.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">Computer: </span>
              <span className="text-sm text-blue-100">{log.computer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">Provider: </span>
              <span className="text-sm text-blue-100">{log.provider_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">Target User: </span>
              <span className="text-sm text-blue-100">{log.target_user_name}</span>
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
          </div>

          {/* Raw Data Toggle */}
          <button
            onClick={() => onToggleExpand(log.id)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "transform rotate-90"
              )}
            />
            <Terminal className="h-4 w-4" />
            <span className="text-sm">Raw Data</span>
          </button>

          {/* Expanded Raw Data */}
          {isExpanded && (
            <div className="mt-2 overflow-x-auto">
              <pre className="p-4 bg-black/60 rounded-lg border border-blue-500/10 text-xs text-blue-100 font-mono whitespace-pre-wrap">
                {typeof log.raw === 'string'
                  ? JSON.stringify(JSON.parse(log.raw), null, 2)
                  : JSON.stringify(log.raw, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineLogCard;
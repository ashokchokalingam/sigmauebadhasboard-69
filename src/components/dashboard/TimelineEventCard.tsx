import { Alert } from "./types";
import { Terminal, ChevronDown, ChevronUp, Monitor, User, AlertTriangle } from "lucide-react";
import { extractTacticsAndTechniques } from "./utils";

interface TimelineEventCardProps {
  alert: Alert;
  isExpanded: boolean;
  onToggleRaw: (alertId: number, event: React.MouseEvent) => void;
  isFirst: boolean;
}

const TimelineEventCard = ({ alert, isExpanded, onToggleRaw, isFirst }: TimelineEventCardProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  const time = new Date(alert.system_time);

  return (
    <div className="relative pl-16">
      {/* Time indicator */}
      <div className="absolute left-0 -translate-x-[calc(50%-1px)] flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full ${isFirst ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} shadow-lg shadow-blue-500/20`} />
        <time className="mt-2 text-sm text-blue-400 font-mono whitespace-nowrap">
          {time.toLocaleTimeString()}
        </time>
      </div>

      {/* Event card */}
      <div className="space-y-4">
        <div className={`bg-blue-950/30 rounded-lg p-4 border transition-all
          ${isExpanded ? 'border-blue-400 bg-blue-950/40' : 'border-blue-500/10'}`}
        >
          {/* Title and Outlier Badge */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-100">{alert.title}</h3>
            <div className="flex items-center gap-2">
              {alert.dbscan_cluster === -1 && (
                <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Outlier
                </span>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-blue-400">Computer</p>
              <p className="text-base text-blue-100 font-mono flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                {alert.computer_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400">User ID</p>
              <p className="text-base text-blue-100 font-mono flex items-center gap-2">
                <User className="h-4 w-4" />
                {alert.user_id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400">Event ID</p>
              <p className="text-base text-blue-100 font-mono">{alert.event_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400">Provider</p>
              <p className="text-base text-blue-100">{alert.provider_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400">Rule ID</p>
              <p className="text-base text-blue-100 font-mono">{alert.ruleid}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400">Rule Level</p>
              <p className="text-base text-blue-100">{alert.rule_level}</p>
            </div>
            {alert.ip_address && (
              <div>
                <p className="text-sm font-medium text-blue-400">IP Address</p>
                <p className="text-base text-blue-100 font-mono">{alert.ip_address}</p>
              </div>
            )}
            {alert.task && (
              <div>
                <p className="text-sm font-medium text-blue-400">Task</p>
                <p className="text-base text-blue-100">{alert.task}</p>
              </div>
            )}
          </div>

          {/* Tactics and Techniques */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-blue-400">Tactics</p>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                {tactics || 'N/A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400">Techniques</p>
              <div className="flex flex-col gap-2">
                {techniques.length > 0 ? (
                  techniques.map((technique, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-lg border border-purple-500/20 w-fit"
                    >
                      {technique}
                    </span>
                  ))
                ) : (
                  <span className="text-purple-400">N/A</span>
                )}
              </div>
            </div>
          </div>

          {/* Raw Log Toggle Button */}
          <button
            onClick={(e) => onToggleRaw(alert.id, e)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
          >
            <Terminal className="h-4 w-4" />
            Raw Log
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Expandable Raw Log Section */}
        {isExpanded && (
          <div className="bg-black/60 rounded-lg border border-blue-500/10 transition-all">
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-blue-100">
                {JSON.stringify(JSON.parse(alert.raw), null, 2)}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineEventCard;
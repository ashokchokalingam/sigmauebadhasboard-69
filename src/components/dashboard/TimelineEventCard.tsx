import { AlertTriangle } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";
import TimelineRawLog from "./TimelineRawLog";

interface TimelineEventCardProps {
  alert: Alert;
  isExpanded: boolean;
  onToggleRaw: (id: string, event: React.MouseEvent) => void;
  isFirst: boolean;
}

const TimelineEventCard = ({ alert, isExpanded, onToggleRaw, isFirst }: TimelineEventCardProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  const time = new Date(alert.system_time);

  return (
    <div className="relative pl-16">
      {/* Time indicator */}
      <div className="absolute left-0 -translate-x-[calc(50%-1px)] flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${isFirst ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} shadow-lg shadow-blue-500/20`} />
        <time className="mt-1 text-sm text-blue-400 font-mono whitespace-nowrap">
          {time.toLocaleTimeString()}
        </time>
      </div>

      {/* Event card */}
      <div className="space-y-2">
        <div className={`bg-blue-950/30 rounded-lg p-3 border transition-all
          ${isExpanded ? 'border-blue-400 bg-blue-950/40' : 'border-blue-500/10'}`}
        >
          {/* Title Section */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="col-span-2 bg-purple-950/20 border-purple-500/10 p-2 rounded-lg">
              <h4 className="text-sm font-medium text-purple-400 mb-0.5">Title</h4>
              <p className="text-base text-purple-100">{alert.title}</p>
            </div>
            <div className="bg-purple-950/20 border-purple-500/10 p-2 rounded-lg">
              <h4 className="text-sm font-medium text-purple-400 mb-0.5">Rule ID</h4>
              <p className="text-sm text-purple-100 font-mono break-all">{alert.rule_id}</p>
            </div>
            <div className="bg-purple-950/20 border-purple-500/10 p-2 rounded-lg">
              <h4 className="text-sm font-medium text-purple-400 mb-0.5">Severity</h4>
              <p className="text-base text-purple-100 capitalize">{alert.rule_level}</p>
            </div>
          </div>

          {/* User & System Info Section */}
          <div className="space-y-2 bg-blue-950/20 p-2 rounded-lg mb-2">
            <h3 className="text-base font-semibold text-blue-300">User & System Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium text-blue-400">Username</p>
                <p className="text-sm text-blue-100 font-mono">{alert.user_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">Computer Name</p>
                <p className="text-sm text-blue-100 font-mono">{alert.computer_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">IP Address</p>
                <p className="text-sm text-blue-100 font-mono">{alert.ip_address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">Time</p>
                <p className="text-sm text-blue-100 font-mono">
                  {time.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Section */}
          <div className="space-y-2 bg-green-950/20 p-2 rounded-lg mb-2">
            <h3 className="text-base font-semibold text-green-300">MITRE ATT&CK</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium text-green-400">Tactics</p>
                <p className="text-sm text-green-100">{tactics || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-400">Techniques</p>
                <div className="flex flex-wrap gap-1">
                  {techniques.length > 0 ? (
                    techniques.map((technique, index) => (
                      <span 
                        key={index}
                        className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-sm rounded-lg border border-green-500/20"
                      >
                        {technique}
                      </span>
                    ))
                  ) : (
                    <span className="text-green-100">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="space-y-2 bg-blue-950/20 p-2 rounded-lg mb-2">
            <h3 className="text-base font-semibold text-blue-300">Event Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium text-blue-400">Event ID</p>
                <p className="text-sm text-blue-100">{alert.event_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">Task</p>
                <p className="text-sm text-blue-100">{alert.task_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">Provider Name</p>
                <p className="text-sm text-blue-100">{alert.provider_name}</p>
              </div>
            </div>
          </div>

          {/* Raw Log Section */}
          <TimelineRawLog alert={alert} />
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
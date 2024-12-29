import { AlertTriangle } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";
import TimelineRawLog from "./TimelineRawLog";

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
          {/* Title Section */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2 bg-purple-950/20 border-purple-500/10 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-purple-400 mb-1">Title</h4>
              <p className="text-lg text-purple-100">{alert.title}</p>
            </div>
            <div className="bg-purple-950/20 border-purple-500/10 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-purple-400 mb-1">Rule ID</h4>
              <p className="text-sm text-purple-100 font-mono break-all">{alert.ruleid}</p>
            </div>
            <div className="bg-purple-950/20 border-purple-500/10 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-purple-400 mb-1">Severity</h4>
              <p className="text-lg text-purple-100 capitalize">{alert.rule_level}</p>
            </div>
          </div>

          {/* User & System Info Section */}
          <div className="space-y-4 bg-blue-950/20 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-blue-300">User & System Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-400">Username</p>
                <p className="text-base text-blue-100 font-mono">{alert.user_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">Computer Name</p>
                <p className="text-base text-blue-100 font-mono">{alert.computer_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">IP Address</p>
                <p className="text-base text-blue-100 font-mono">{alert.ip_address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">Time</p>
                <p className="text-base text-blue-100 font-mono">
                  {time.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Section */}
          <div className="space-y-4 bg-green-950/20 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-green-300">MITRE ATT&CK</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-green-400">Tactics</p>
                <p className="text-base text-green-100">{tactics || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-400">Techniques</p>
                <div className="flex flex-col gap-2">
                  {techniques.length > 0 ? (
                    techniques.map((technique, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-green-500/10 text-green-400 text-sm rounded-lg border border-green-500/20 w-fit"
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
          <div className="space-y-4 bg-blue-950/20 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-blue-300">Event Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-400">Event ID</p>
                <p className="text-base text-blue-100">{alert.event_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">Task</p>
                <p className="text-base text-blue-100">{alert.task}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">Provider Name</p>
                <p className="text-base text-blue-100">{alert.provider_name}</p>
              </div>
            </div>
          </div>

          {/* Raw Log Section */}
          <TimelineRawLog 
            raw={alert.raw}
            isExpanded={isExpanded}
            onToggle={(e) => onToggleRaw(alert.id, e)}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;
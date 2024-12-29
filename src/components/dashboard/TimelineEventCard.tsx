import { AlertTriangle } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";
import TimelineMetadataGrid from "./TimelineMetadataGrid";
import TimelineMitreSection from "./TimelineMitreSection";
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

          <TimelineMetadataGrid alert={alert} />
          <TimelineMitreSection tactics={tactics} techniques={techniques} />
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
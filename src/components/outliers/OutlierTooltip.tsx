import { format } from "date-fns";
import { ChartDataPoint } from "./types";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-yellow-400";
    case "low":
      return "text-green-400";
    default:
      return "text-blue-400";
  }
};

export const OutlierTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as ChartDataPoint;
  
  return (
    <div className="bg-black/90 p-4 rounded-lg border border-purple-500/20 backdrop-blur-sm">
      <p className="text-purple-300 font-medium mb-2">{data.title}</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Anomalies:</span>
          <span className="text-white font-bold">{data.count}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Risk Score:</span>
          <span className="text-white font-bold">
            {data.risk ? data.risk.toFixed(2) : 'N/A'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">First Seen:</span>
          <span className="text-white">{format(new Date(data.firstSeen), 'MMM d, yyyy h:mm a')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Last Seen:</span>
          <span className="text-white">{format(new Date(data.lastSeen), 'MMM d, yyyy h:mm a')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Impacted Computers:</span>
          <span className="text-white">{data.impactedComputers.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Impacted Users:</span>
          <span className="text-white">{data.impactedUsers.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Tactics:</span>
          <span className="text-white">{data.tactics.join(', ') || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Severity:</span>
          <span className={`font-bold ${getSeverityColor(data.severity)}`}>
            {data.severity.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
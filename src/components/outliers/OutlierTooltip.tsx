
import { format, formatDistanceToNow } from "date-fns";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const OutlierTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;
  const date = new Date(label);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#D32F2F';
      case 'high':
        return '#FF5722';
      case 'medium':
        return '#FFB74D';
      case 'low':
        return '#66BB6A';
      default:
        return '#9333EA';
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="bg-[#1A1F2C]/95 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 shadow-xl">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: getSeverityColor(data.severity) }}
          />
          <span className="text-purple-300 text-sm">
            {data.severity} Severity
          </span>
        </div>

        <div className="text-white font-medium text-sm">
          First seen: {getRelativeTime(data.firstSeen)}
        </div>
        <div className="text-white font-medium text-sm">
          Last seen: {getRelativeTime(data.lastSeen)}
        </div>

        <div className="text-purple-200 font-medium text-sm mt-2">
          {data.count} anomalies detected
        </div>

        {data.impactedComputers.length > 0 && (
          <div className="text-purple-300 text-xs">
            {data.impactedComputers.length} computer{data.impactedComputers.length !== 1 ? 's' : ''} affected
          </div>
        )}
        
        {data.impactedUsers.length > 0 && (
          <div className="text-purple-300 text-xs">
            {data.impactedUsers.length} user{data.impactedUsers.length !== 1 ? 's' : ''} affected
          </div>
        )}

        {data.tactics.length > 0 && (
          <div className="text-purple-300 text-xs mt-2">
            MITRE ATT&CK Tactics: {data.tactics.join(', ')}
          </div>
        )}

        {data.description && (
          <div className="text-purple-200 text-xs mt-2 max-w-[300px]">
            {data.description}
          </div>
        )}
      </div>
    </div>
  );
};

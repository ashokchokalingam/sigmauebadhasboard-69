
import { Shield, Activity, CircleDot } from "lucide-react";
import { formatDateTime } from "@/utils/dateTimeUtils";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  coordinate?: { x: number; y: number };
}

export const OutlierTooltip = ({ active, payload, label, coordinate }: TooltipProps) => {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;
  
  if (!data) return null;

  const getSeverityColor = (severity: string = 'medium') => {
    switch (severity?.toLowerCase()) {
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

  const getTacticIcon = (tactic: string) => {
    switch (tactic?.toLowerCase()) {
      case 'initial_access':
      case 'initial-access':
        return <Shield className="w-3.5 h-3.5" />;
      case 'execution':
        return <Activity className="w-3.5 h-3.5" />;
      default:
        return <CircleDot className="w-3.5 h-3.5" />;
    }
  };

  // Safely split comma-separated strings
  const safeSplit = (value: string | null | undefined): string[] => {
    if (!value || typeof value !== 'string') return [];
    return value.split(',').map(item => item.trim()).filter(Boolean);
  };

  const tactics = safeSplit(data.tactics);
  const techniques = safeSplit(data.techniques);

  const xPos = coordinate ? coordinate.x : 0;
  const tooltipStyle = {
    left: xPos + 60,
    top: '50%',
    transform: 'translateY(-50%)',
    position: 'fixed' as const,
  };

  return (
    <div 
      className="fixed bg-[#1A1F2C] border border-purple-500/20 rounded-lg p-4 
        shadow-xl w-[400px] pointer-events-none z-50"
      style={tooltipStyle}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getSeverityColor(data.severity) }}
          />
          <span className="text-gray-200 text-sm font-medium">
            {(data.severity || 'Unknown').toUpperCase()} Severity Alert
          </span>
        </div>

        <div className="text-gray-100 font-semibold">
          {data.title || 'Untitled Alert'}
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-y-1 text-sm">
          <div className="text-purple-300/70">Risk Score:</div>
          <div className="text-right text-green-400 font-medium">
            {data.risk || 'N/A'}
          </div>
          <div className="text-purple-300/70">First seen:</div>
          <div className="text-right text-gray-300">
            {formatDateTime(data.first_seen || data.firstSeen)}
          </div>
          <div className="text-purple-300/70">Last seen:</div>
          <div className="text-right text-gray-300">
            {formatDateTime(data.last_seen || data.lastSeen)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 bg-purple-500/20 rounded-md text-xs text-purple-200 font-medium">
            {data.anomaly_count || data.count || 1} anomalies
          </span>
        </div>

        {(data.impacted_computers || data.impactedComputers) && (
          <div className="space-y-1">
            <div className="text-purple-300/70 text-sm">Systems:</div>
            <div className="text-cyan-400 text-sm break-all">
              {data.impacted_computers || data.impactedComputers}
            </div>
          </div>
        )}
        
        {(data.origin_users || data.impactedUsers) && (
          <div className="space-y-1">
            <div className="text-purple-300/70 text-sm">Users:</div>
            <div className="text-cyan-400 text-sm break-all">
              {data.origin_users || data.impactedUsers}
            </div>
          </div>
        )}

        {tactics.length > 0 && (
          <div>
            <div className="text-purple-200 text-sm font-medium mb-2">MITRE ATT&CK</div>
            <div className="flex flex-wrap gap-2">
              {tactics.map((tactic: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/10 
                    border border-purple-500/20 text-purple-200 text-xs"
                >
                  {getTacticIcon(tactic)}
                  <span>{tactic}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {techniques.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techniques.map((technique: string, index: number) => (
              <div 
                key={index}
                className="px-2 py-1 rounded bg-purple-900/40 text-purple-200 text-xs font-medium"
              >
                {technique}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

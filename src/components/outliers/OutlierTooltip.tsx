
import { format } from "date-fns";
import { Shield, Activity, CircleDot } from "lucide-react";

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

  const getTacticIcon = (tactic: string) => {
    switch (tactic.toLowerCase()) {
      case 'initial_access':
        return <Shield className="w-3 h-3" />;
      case 'execution':
        return <Activity className="w-3 h-3" />;
      default:
        return <CircleDot className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-[#1A1F2C]/95 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 shadow-xl max-w-md
      transform transition-transform duration-200 ease-in-out z-50">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: getSeverityColor(data.severity) }}
          />
          <span className="text-purple-300 text-sm font-medium">
            {data.severity.toUpperCase()} Severity Alert
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-white/90 text-sm flex items-center justify-between">
            <span className="text-purple-300/80">First seen:</span>
            <span>{format(new Date(data.firstSeen), "yyyy-MM-dd HH:mm:ss 'UTC'")}</span>
          </div>
          <div className="text-white/90 text-sm flex items-center justify-between">
            <span className="text-purple-300/80">Last seen:</span>
            <span>{format(new Date(data.lastSeen), "yyyy-MM-dd HH:mm:ss 'UTC'")}</span>
          </div>
        </div>

        <div className="text-purple-200 font-medium flex items-center gap-2">
          <span className="px-2 py-0.5 bg-purple-500/10 rounded-md">
            {data.count} anomalies detected
          </span>
        </div>

        <div className="space-y-2">
          {data.impactedComputers.length > 0 && (
            <div className="text-purple-300 text-sm flex items-center justify-between bg-purple-500/5 px-2 py-1 rounded-md">
              <span className="font-medium">Systems affected:</span>
              <span>{data.impactedComputers.length}</span>
            </div>
          )}
          
          {data.impactedUsers.length > 0 && (
            <div className="text-purple-300 text-sm flex items-center justify-between bg-purple-500/5 px-2 py-1 rounded-md">
              <span className="font-medium">Users affected:</span>
              <span>{data.impactedUsers.length}</span>
            </div>
          )}
        </div>

        {data.tactics.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-purple-200 text-sm font-medium">MITRE ATT&CK</div>
            <div className="flex flex-wrap gap-1.5">
              {data.tactics.map((tactic: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 
                    border border-purple-500/20 text-purple-300 text-xs cursor-pointer
                    hover:bg-purple-500/20 transition-colors"
                >
                  {getTacticIcon(tactic)}
                  {tactic}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.description && (
          <div className="text-purple-200/90 text-sm mt-2 border-t border-purple-500/20 pt-2
            max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20
            scrollbar-track-transparent">
            {data.description}
          </div>
        )}
      </div>
    </div>
  );
};

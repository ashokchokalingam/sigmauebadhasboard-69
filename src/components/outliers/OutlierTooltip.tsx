import { Shield, Activity, CircleDot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDateTime } from "@/utils/dateTimeUtils";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  coordinate?: { x: number; y: number };
}

export const OutlierTooltip = ({ active, payload, label, coordinate }: TooltipProps) => {
  if (!active || !payload?.[0]) return null;

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: coordinate?.x || 0, y: 0 });

  const data = payload[0].payload;
  
  if (!data) return null;

  useEffect(() => {
    if (!tooltipRef.current || !coordinate) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    
    setPosition({
      x: coordinate.x,
      y: -tooltipRect.height / 2
    });
  }, [coordinate]);

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
        return <Shield className="w-3 h-3" />;
      case 'execution':
        return <Activity className="w-3 h-3" />;
      default:
        return <CircleDot className="w-3 h-3" />;
    }
  };

  // Safely split comma-separated strings
  const safeSplit = (value: string | null | undefined): string[] => {
    if (!value || typeof value !== 'string') return [];
    return value.split(',').map(item => item.trim()).filter(Boolean);
  };

  const tactics = safeSplit(data.tactics);
  const techniques = safeSplit(data.techniques);

  const formatTimestamps = (date: string) => {
    return formatDateTime(date);
  };

  return (
    <div 
      ref={tooltipRef}
      className="absolute bg-[#1A1F2C]/95 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 
        shadow-xl w-[400px] pointer-events-none"
      style={{
        left: position.x,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50
      }}
    >
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: getSeverityColor(data.severity) }}
          />
          <span className="text-purple-300 text-sm font-medium">
            {(data.severity || 'Unknown').toUpperCase()} Severity Alert
          </span>
        </div>

        <div className="text-sm text-purple-100 font-medium">
          {data.title || 'Untitled Alert'}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-purple-300/80">Risk Score:</div>
          <div className="text-right text-purple-200">
            {data.risk || 'N/A'}
          </div>
          <div className="text-purple-300/80">First seen:</div>
          <div className="text-right">
            {formatTimestamps(data.first_seen || data.firstSeen)}
          </div>
          <div className="text-purple-300/80">Last seen:</div>
          <div className="text-right">
            {formatTimestamps(data.last_seen || data.lastSeen)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-purple-500/10 rounded text-xs text-purple-200">
            {data.anomaly_count || data.count || 1} anomalies
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {data.impacted_computers || data.impactedComputers ? (
            <>
              <div className="text-purple-300/80">Systems:</div>
              <div className="text-right text-purple-200 truncate">
                {data.impacted_computers || data.impactedComputers}
              </div>
            </>
          ) : null}
          
          {data.origin_users || data.impactedUsers ? (
            <>
              <div className="text-purple-300/80">Users:</div>
              <div className="text-right text-purple-200 truncate">
                {data.origin_users || data.impactedUsers}
              </div>
            </>
          ) : null}

          {data.source_ips || data.sourceIps ? (
            <>
              <div className="text-purple-300/80">Source IP:</div>
              <div className="text-right text-purple-200">
                {data.source_ips || data.sourceIps}
              </div>
            </>
          ) : null}
        </div>

        {tactics.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-purple-200 text-xs font-medium">MITRE ATT&CK</div>
            <div className="flex flex-wrap gap-1">
              {tactics.map((tactic: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 
                    border border-purple-500/20 text-purple-300 text-xs"
                >
                  {getTacticIcon(tactic)}
                  <span className="truncate max-w-[100px]">{tactic}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {techniques.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {techniques.map((technique: string, index: number) => (
              <div 
                key={index}
                className="px-1.5 py-0.5 rounded bg-purple-900/40 
                  border border-purple-500/20 text-purple-300 text-xs"
              >
                {technique.toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

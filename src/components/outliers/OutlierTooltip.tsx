
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
        return <Shield className="w-4 h-4" />;
      case 'execution':
        return <Activity className="w-4 h-4" />;
      default:
        return <CircleDot className="w-4 h-4" />;
    }
  };

  const safeSplit = (value: string | null | undefined): string[] => {
    if (!value || typeof value !== 'string') return [];
    return value.split(',').map(item => item.trim()).filter(Boolean);
  };

  const tactics = safeSplit(data.tactics);
  const techniques = safeSplit(data.techniques);

  const formatTimestamps = (date: string) => {
    return formatDateTime(date);
  };

  const xPos = coordinate ? coordinate.x : 0;
  const tooltipStyle = {
    transform: 'translateY(-50%)',
    left: Math.max(10, xPos),
    position: 'fixed' as const
  };

  return (
    <div 
      className="fixed bg-[#1A1F2C]/95 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 
        shadow-xl w-[450px] pointer-events-none z-50"
      style={tooltipStyle}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: getSeverityColor(data.severity) }}
          />
          <span className="text-purple-300 text-base font-medium">
            {(data.severity || 'Unknown').toUpperCase()} Severity Alert
          </span>
        </div>

        <div className="text-base text-purple-100 font-medium">
          {data.title || 'Untitled Alert'}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
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
          <span className="px-2.5 py-1 bg-purple-500/10 rounded text-sm text-purple-200">
            {data.anomaly_count || data.count || 1} anomalies
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
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
          <div className="space-y-2">
            <div className="text-purple-200 text-sm font-medium">MITRE ATT&CK</div>
            <div className="flex flex-wrap gap-1.5">
              {tactics.map((tactic: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 
                    border border-purple-500/20 text-purple-300 text-sm"
                >
                  {getTacticIcon(tactic)}
                  <span className="truncate max-w-[120px]">{tactic}</span>
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
                className="px-2 py-1 rounded bg-purple-900/40 
                  border border-purple-500/20 text-purple-300 text-sm"
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

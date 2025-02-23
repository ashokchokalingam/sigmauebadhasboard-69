
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
        return '#FF3B30';
      case 'high':
        return '#FF9500';
      case 'medium':
        return '#FFB74D';
      case 'low':
        return '#34C759';
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
  const yPos = coordinate ? coordinate.y : 0;
  
  const tooltipStyle = {
    position: 'absolute' as const,
    left: Math.max(10, xPos),
    top: yPos,
    transform: 'translate(20px, -50%)',
    zIndex: 50
  };

  return (
    <div 
      className="absolute bg-[#1A1F2C]/95 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 
        shadow-xl w-[450px] pointer-events-none"
      style={tooltipStyle}
    >
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: getSeverityColor(data.severity) }}
          />
          <span className="text-[15px] text-purple-300 font-medium tracking-wide">
            {(data.severity || 'Unknown').toUpperCase()} Severity Alert
          </span>
        </div>

        <div className="text-[15px] text-purple-100 font-medium">
          {data.title || 'Untitled Alert'}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-[13px] text-purple-300/80 font-medium">Risk Score:</div>
          <div className="text-right">
            <span className="text-lg font-bold bg-gradient-to-r from-orange-400 via-purple-400 to-pink-400 
              bg-clip-text text-transparent animate-pulse">
              {data.risk || 'N/A'}
            </span>
          </div>
          <div className="text-[14px] text-purple-300/80">First seen:</div>
          <div className="text-right text-[15px] font-medium text-cyan-300 hover:text-cyan-200 transition-colors">
            {formatTimestamps(data.first_seen || data.firstSeen)}
          </div>
          <div className="text-[14px] text-purple-300/80">Last seen:</div>
          <div className="text-right text-[15px] font-medium text-amber-300 hover:text-amber-200 transition-colors">
            {formatTimestamps(data.last_seen || data.lastSeen)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-purple-500/10 rounded text-[13px] text-purple-200 font-medium">
            {data.anomaly_count || data.count || 1} anomalies
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {data.impacted_computers || data.impactedComputers ? (
            <>
              <div className="text-[14px] text-purple-300/80 font-medium">Systems:</div>
              <div className="text-right text-[15px] font-medium text-[#1EAEDB] hover:text-[#0FA0CE] transition-colors truncate">
                {data.impacted_computers || data.impactedComputers}
              </div>
            </>
          ) : null}
          
          {data.origin_users || data.impactedUsers ? (
            <>
              <div className="text-[14px] text-purple-300/80 font-medium">Users:</div>
              <div className="text-right text-[15px] font-medium text-emerald-300 hover:text-emerald-200 transition-colors truncate">
                {data.origin_users || data.impactedUsers}
              </div>
            </>
          ) : null}

          {data.source_ips || data.sourceIps ? (
            <>
              <div className="text-[13px] text-purple-300/80">Source IP:</div>
              <div className="text-right text-[13px] font-medium text-purple-200">
                {data.source_ips || data.sourceIps}
              </div>
            </>
          ) : null}
        </div>

        {tactics.length > 0 && (
          <div className="space-y-2">
            <div className="text-[13px] text-purple-200 font-medium">MITRE ATT&CK</div>
            <div className="flex flex-wrap gap-1.5">
              {tactics.map((tactic: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 
                    border border-purple-500/20 text-purple-300 text-[13px] hover:bg-purple-500/20 
                    transition-colors"
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
                  border border-purple-500/20 text-purple-300 text-[13px] hover:bg-purple-800/40
                  transition-colors"
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

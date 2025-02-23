
import { Shield, Activity, CircleDot, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDateTime } from "@/utils/dateTimeUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        return '#FFA500';
      case 'low':
        return '#34C759';
      default:
        return '#9333EA';
    }
  };

  const getRiskScoreColor = (risk: number) => {
    if (risk >= 200) return 'from-[#FF4D4D] to-[#FF6B6B]';
    if (risk >= 100) return 'from-[#FFA500] to-[#FFB732]';
    if (risk >= 50) return 'from-[#FFC107] to-[#FFD54F]';
    return 'from-[#00FF00] to-[#32CD32]';
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
      className="absolute bg-[#1A1F2C]/95 backdrop-blur-sm border border-purple-500/20 rounded-lg p-5 
        shadow-xl w-[480px] pointer-events-none font-inter"
      style={tooltipStyle}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-3.5 h-3.5 rounded-full animate-pulse shadow-lg"
            style={{ 
              backgroundColor: getSeverityColor(data.severity),
              boxShadow: `0 0 12px ${getSeverityColor(data.severity)}40`
            }}
          />
          <span className="text-[17px] text-purple-200 font-semibold tracking-wide">
            {(data.severity || 'Unknown').toUpperCase()} Severity Alert
          </span>
        </div>

        <div className="text-[15px] text-purple-100 font-medium leading-relaxed">
          {data.title || 'Untitled Alert'}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-[14px] text-purple-300/90 font-medium">Risk Score:</div>
          <div className="text-right flex items-center justify-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex items-center">
                    <span className={`text-[19px] font-bold bg-gradient-to-r ${getRiskScoreColor(data.risk)} 
                      bg-clip-text text-transparent`}>
                      {data.risk || 'N/A'}
                    </span>
                    <Info className="w-4 h-4 ml-1.5 text-purple-400/70" />
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  className="bg-black/90 border-purple-500/20 text-purple-100 text-[13px] max-w-[200px]"
                >
                  Risk score calculation based on severity, impact, and historical patterns
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="text-[14px] text-purple-300/90">First seen:</div>
          <div className="text-right text-[14px] font-medium text-[#CCCCCC]">
            {formatTimestamps(data.first_seen || data.firstSeen)}
          </div>
          <div className="text-[14px] text-purple-300/90">Last seen:</div>
          <div className="text-right text-[14px] font-medium text-[#CCCCCC]">
            {formatTimestamps(data.last_seen || data.lastSeen)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-1.5 bg-[#6A0DAD] rounded-full text-[13px] text-white font-medium 
            shadow-lg shadow-purple-900/20">
            {data.anomaly_count || data.count || 1} anomalies
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.impacted_computers || data.impactedComputers ? (
            <>
              <div className="text-[14px] text-purple-300/90 font-medium">Systems:</div>
              <div className="text-right text-[14px] font-medium text-[#40E0D0] hover:text-[#45E8D8] 
                transition-colors truncate cursor-pointer border-b border-[#40E0D0]/30 hover:border-[#40E0D0]">
                {data.impacted_computers || data.impactedComputers}
              </div>
            </>
          ) : null}
          
          {data.origin_users || data.impactedUsers ? (
            <>
              <div className="text-[14px] text-purple-300/90 font-medium">Users:</div>
              <div className="text-right text-[14px] font-medium text-[#40E0D0] hover:text-[#45E8D8] 
                transition-colors truncate cursor-pointer border-b border-[#40E0D0]/30 hover:border-[#40E0D0]">
                {data.origin_users || data.impactedUsers}
              </div>
            </>
          ) : null}

          {data.source_ips || data.sourceIps ? (
            <>
              <div className="text-[13px] text-purple-300/90">Source IP:</div>
              <div className="text-right text-[13px] font-medium text-purple-200">
                {data.source_ips || data.sourceIps}
              </div>
            </>
          ) : null}
        </div>

        {tactics.length > 0 && (
          <div className="space-y-2.5">
            <div className="text-[13px] text-purple-200 font-medium">MITRE ATT&CK</div>
            <div className="flex flex-wrap gap-1.5">
              {tactics.map((tactic: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/10 
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
                className="px-2.5 py-1 rounded bg-purple-900/40 
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


import { Info } from "lucide-react";
import { formatDateTime } from "@/utils/dateTimeUtils";
import { TacticIcon } from "./components/TacticIcon";
import { RiskScoreDisplay } from "./components/RiskScoreDisplay";
import { getSeverityColor } from "./utils/colorUtils";

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

  const safeSplit = (value: string | null | undefined): string[] => {
    if (!value || typeof value !== 'string') return [];
    return value.split(',').map(item => item.trim()).filter(Boolean);
  };

  const tactics = safeSplit(data.tactics);
  const techniques = safeSplit(data.techniques);

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
          <RiskScoreDisplay risk={data.risk} severity={data.severity} />
          
          <div className="text-[14px] text-purple-300/90">First seen:</div>
          <div className="text-right text-[14px] font-medium text-[#CCCCCC]">
            {formatDateTime(data.first_seen || data.firstSeen)}
          </div>
          <div className="text-[14px] text-purple-300/90">Last seen:</div>
          <div className="text-right text-[14px] font-medium text-[#CCCCCC]">
            {formatDateTime(data.last_seen || data.lastSeen)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-1.5 bg-[#6A0DAD] rounded-full text-[13px] text-white font-medium 
            shadow-[0_0_15px_rgba(106,13,173,0.3)] hover:shadow-[0_0_20px_rgba(106,13,173,0.4)] 
            transition-shadow duration-300">
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
                <TacticIcon tactic={tactic} />
                <span className="truncate max-w-[120px]">{tactic}</span>
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
};

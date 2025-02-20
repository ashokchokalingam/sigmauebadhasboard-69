import { format } from "date-fns";
import { Shield, Activity, CircleDot } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  coordinate?: { x: number; y: number };
}

export const OutlierTooltip = ({ active, payload, label, coordinate }: TooltipProps) => {
  if (!active || !payload?.[0]) return null;

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const data = payload[0].payload;

  useEffect(() => {
    if (!tooltipRef.current || !coordinate) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const chartContainer = tooltip.closest('.recharts-wrapper');
    
    if (!chartContainer) return;
    
    const containerRect = chartContainer.getBoundingClientRect();
    
    // Default position (right of cursor)
    let xPos = 10;
    let yPos = -tooltipRect.height / 2;

    // Keep tooltip within chart bounds
    if (coordinate.x + tooltipRect.width + 10 > containerRect.right) {
      xPos = -tooltipRect.width - 10;
    }

    setPosition({ x: xPos, y: yPos });
  }, [coordinate]);

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
    <div 
      ref={tooltipRef}
      className="absolute bg-[#1A1F2C]/95 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 
        shadow-xl w-[320px] pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
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
            {data.severity.toUpperCase()} Severity Alert
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-purple-300/80">First seen:</div>
          <div className="text-right text-white/90">
            {format(new Date(data.firstSeen), "MMM d, HH:mm")}
          </div>
          <div className="text-purple-300/80">Last seen:</div>
          <div className="text-right text-white/90">
            {format(new Date(data.lastSeen), "MMM d, HH:mm")}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-purple-500/10 rounded text-xs text-purple-200">
            {data.count} anomalies
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {data.impactedComputers.length > 0 && (
            <>
              <div className="text-purple-300/80">Systems affected:</div>
              <div className="text-right text-purple-200">
                {data.impactedComputers.length}
              </div>
            </>
          )}
          
          {data.impactedUsers.length > 0 && (
            <>
              <div className="text-purple-300/80">Users affected:</div>
              <div className="text-right text-purple-200">
                {data.impactedUsers.length}
              </div>
            </>
          )}
        </div>

        {data.tactics.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-purple-200 text-xs font-medium">MITRE ATT&CK</div>
            <div className="flex flex-wrap gap-1">
              {data.tactics.map((tactic: string, index: number) => (
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

        {data.description && (
          <div className="text-purple-200/90 text-xs border-t border-purple-500/20 pt-2
            max-h-[80px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20
            scrollbar-track-transparent">
            {data.description}
          </div>
        )}
      </div>
    </div>
  );
};


import { useQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import { ChevronDown, ChevronUp, Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatInTimeZone } from 'date-fns-tz';

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect?: () => void;
  detailedLogs?: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  instances?: Alert[];
}

const TimelineEventCard = ({ 
  event, 
  isLast, 
  isLatest,
  entityType,
  onSelect,
  detailedLogs,
  isExpanded,
  onToggleExpand,
  instances = []
}: TimelineEventCardProps) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const getRiskLevel = (level: string = 'low') => {
    switch (level.toLowerCase()) {
      case 'critical':
        return { 
          color: 'text-red-400', 
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          hover: 'hover:border-red-500/50',
          cardBg: 'bg-red-950/20'
        };
      case 'high':
        return { 
          color: 'text-orange-400', 
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          hover: 'hover:border-orange-500/50',
          cardBg: 'bg-orange-950/20'
        };
      case 'medium':
        return { 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          hover: 'hover:border-yellow-500/40',
          cardBg: 'bg-yellow-950/10'
        };
      default:
        return { 
          color: 'text-green-400', 
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          hover: 'hover:border-green-500/40',
          cardBg: 'bg-green-950/10'
        };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      utc: formatInTimeZone(date, 'UTC', "MMM dd, yyyy - HH:mm:ss 'UTC'"),
      local: formatInTimeZone(date, userTimezone, "MMM dd, yyyy - hh:mm:ss aa")
    };
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailsExpanded((prev) => !prev);
    if (onSelect) onSelect();
  };

  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);
  const firstSeen = formatTimestamp(event.first_time_seen || event.system_time);
  const lastSeen = formatTimestamp(event.last_time_seen || event.system_time);

  return (
    <div className="group relative pl-4 w-full">
      <div className={cn(
        "absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2",
        color,
        "bg-background"
      )} />
      {!isLast && (
        <div className={cn(
          "absolute left-0 top-8 -ml-[1px] h-full w-[2px]",
          "bg-gradient-to-b from-current to-transparent",
          color
        )} />
      )}

      <div className="relative ml-4 mb-2">
        <div 
          className={cn(
            "rounded-lg border shadow-lg transition-all duration-300",
            cardBg,
            border,
            hover,
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75",
            detailsExpanded && "border-opacity-50"
          )}
        >
          <div 
            onClick={handleCardClick}
            className="p-4 cursor-pointer"
          >
            <TimelineEventHeader
              ruleLevel={event.rule_level}
              totalRecords={event.total_events || 0}
              title={event.title}
              description={event.description}
            />

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm mt-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-purple-400/70">
                      <span>Last seen:</span>
                      <span>{lastSeen.local}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{lastSeen.utc}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-blue-400/70">
                      <span>First seen:</span>
                      <span>{firstSeen.local}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{firstSeen.utc}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {event.tags && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <h4 className="text-base font-medium text-purple-400">MITRE ATT&CK Analysis</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-2">Tactics Identified</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.split(',')
                        .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
                        .map((tactic, index) => (
                          <span 
                            key={index}
                            className="px-2 py-0.5 bg-purple-500/10 text-purple-300 text-sm rounded-full 
                              border border-purple-500/20"
                          >
                            {tactic.replace('attack.', '').split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-2">Techniques Observed</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.split(',')
                        .filter(tag => tag.toLowerCase().includes('t1'))
                        .map((technique, index) => (
                          <span 
                            key={index}
                            className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-sm rounded-full 
                              border border-blue-500/20"
                          >
                            {technique.trim()}
                          </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {instances && instances.length > 1 && (
            <div 
              className="px-4 py-2 border-t border-blue-500/10 flex items-center justify-between cursor-pointer hover:bg-black/20"
              onClick={onToggleExpand}
            >
              <span className="text-sm text-blue-300">
                {isExpanded ? 'Hide' : 'Show'} all instances ({instances.length})
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-blue-300" />
              ) : (
                <ChevronDown className="h-4 w-4 text-blue-300" />
              )}
            </div>
          )}

          {isExpanded && instances && instances.length > 1 && (
            <div className="px-4 py-3 border-t border-blue-500/10 space-y-2">
              {instances.map((instance, idx) => {
                const timestamp = formatTimestamp(instance.last_time_seen || instance.system_time);
                return (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm text-blue-300/70 flex justify-between items-center">
                          <span>Instance {idx + 1}</span>
                          <span>{timestamp.local}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{timestamp.utc}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          )}

          {detailsExpanded && detailedLogs && (
            <div className="border-t border-blue-500/10">
              <TimelineDetailedLogs
                logs={detailedLogs?.computer_impacted_logs || []}
                isLoading={false}
                totalRecords={detailedLogs?.pagination?.total_records || 0}
                entityType="computer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;


import { useQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import { ChevronDown, ChevronUp, Shield } from "lucide-react";
import { formatInTimeZone } from 'date-fns-tz';

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
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
  entityType,
  onSelect,
  detailedLogs,
  isExpanded,
  onToggleExpand,
  instances = []
}: TimelineEventCardProps) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

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
          border: 'border-blue-500/10',
          hover: 'hover:border-blue-500/30',
          cardBg: 'bg-black/40'
        };
      case 'low':
        return { 
          color: 'text-green-400', 
          bg: 'bg-green-500/10',
          border: 'border-blue-500/10',
          hover: 'hover:border-blue-500/30',
          cardBg: 'bg-black/40'
        };
      default:
        return { 
          color: 'text-gray-400', 
          bg: 'bg-gray-500/10',
          border: 'border-blue-500/10',
          hover: 'hover:border-blue-500/30',
          cardBg: 'bg-black/40'
        };
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailsExpanded((prev) => !prev);
    if (onSelect) {
      onSelect();
    }
  };

  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

      <div className="relative ml-4 mb-6 w-full">
        <div 
          className={cn(
            "rounded-lg border shadow-lg transition-all duration-300",
            cardBg,
            border,
            hover,
            detailsExpanded && "border-opacity-50"
          )}
        >
          <div 
            onClick={handleCardClick}
            className="p-6 cursor-pointer"
          >
            <TimelineEventHeader
              ruleLevel={event.rule_level}
              totalRecords={event.total_events || 0}
              title={event.title}
              description={event.description}
            />

            <TimelineEventTimestamps
              firstTimeSeen={event.first_time_seen || ''}
              lastTimeSeen={event.last_time_seen || ''}
            />

            {event.tags && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <h4 className="text-base font-medium text-purple-400">MITRE ATT&CK Analysis</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-2">Tactics Identified</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.split(',')
                        .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
                        .map((tactic, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full 
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
                            className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm rounded-full 
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

          {instances.length > 1 && (
            <div 
              className="px-6 py-3 border-t border-blue-500/10 flex items-center justify-between cursor-pointer hover:bg-black/20"
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

          {isExpanded && instances.length > 1 && (
            <div className="px-6 py-4 border-t border-blue-500/10 space-y-3">
              {instances.map((instance, idx) => (
                <div 
                  key={idx}
                  className="text-sm text-blue-300/70 flex justify-between items-center"
                >
                  <span>Instance {idx + 1}</span>
                  <span>{formatInTimeZone(
                    new Date(instance.last_time_seen || instance.system_time),
                    userTimezone,
                    "MMM dd, yyyy hh:mm:ss aa"
                  )}</span>
                </div>
              ))}
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

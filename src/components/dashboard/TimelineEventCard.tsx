
import { useQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import { User, Monitor, Shield, AlertTriangle } from "lucide-react";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect?: () => void;
  detailedLogs?: any;
}

const TimelineEventCard = ({ 
  event, 
  isLast, 
  entityType,
  onSelect,
  detailedLogs 
}: TimelineEventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskLevel = (level: string = 'low') => {
    switch (level.toLowerCase()) {
      case 'critical':
        return { color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'high':
        return { color: 'text-orange-400', bg: 'bg-orange-500/10' };
      case 'medium':
        return { color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'low':
        return { color: 'text-green-400', bg: 'bg-green-500/10' };
      case 'informational':
        return { color: 'text-blue-400', bg: 'bg-blue-500/10' };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-500/10' };
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
    if (onSelect) {
      onSelect();
    }
  };

  const { color, bg } = getRiskLevel(event.rule_level);

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
          onClick={handleCardClick}
          className={cn(
            "p-6 rounded-lg bg-black/40 border border-blue-500/10",
            "hover:bg-black/60 transition-all duration-300 cursor-pointer w-full",
            isExpanded && "border-blue-500/30"
          )}
        >
          <TimelineEventHeader
            ruleLevel={event.rule_level}
            totalRecords={event.total_events || 0}
            title={event.title}
            description={event.description}
          />

          <div className="grid grid-cols-2 gap-4 mt-4 mb-3">
            <div>
              <h4 className="text-sm font-medium text-blue-400">Risk Score</h4>
              <p className={`text-lg font-medium ${color}`}>
                {event.risk === null ? 'undefined%' : `${event.risk}%`}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-400">ML Cluster</h4>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20">
                {event.ml_cluster === null ? 'Cluster undefined' : `Cluster ${event.ml_cluster}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 mb-3">
            <Monitor className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              Computer: <span className="font-mono text-blue-400">{event.computer_name}</span>
            </span>
          </div>

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

          {isExpanded && detailedLogs && (
            <TimelineDetailedLogs
              logs={detailedLogs?.computer_impacted_logs || []}
              isLoading={false}
              totalRecords={detailedLogs?.pagination?.total_records || 0}
              entityType="computer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

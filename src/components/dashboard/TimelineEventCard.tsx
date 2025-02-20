
import { Alert } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineDetailedLogs from "./TimelineDetailedLogs";
import { User, Monitor } from "lucide-react";
import EntityCardRiskGauge from "./EntityCardRiskGauge";

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

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
    if (onSelect) {
      onSelect();
    }
  };

  const mappedEntityType = 
    entityType === "userorigin" ? "user" :
    entityType === "userimpacted" ? "user" :
    "computer";

  return (
    <div className="group relative pl-4 w-full">
      <div className="absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2 border-green-400 bg-background" />
      {!isLast && (
        <div className="absolute left-0 top-8 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-green-400/50 to-transparent" />
      )}

      <div className="relative ml-4 mb-6 w-full">
        <div 
          onClick={handleCardClick}
          className={cn(
            "p-6 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm cursor-pointer w-full",
            isExpanded && "border-blue-500/30"
          )}
        >
          <TimelineEventHeader
            ruleLevel={event.rule_level}
            totalRecords={event.total_events || 0}
            title={event.title}
            description={event.description}
          />

          <div className="flex items-center justify-between mt-4 mb-3">
            <div className="flex-1">
              <EntityCardRiskGauge riskScore={event.risk?.toString() || null} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-400">ML Cluster</h4>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20">
                {event.ml_cluster === null ? 'N/A' : `Cluster ${event.ml_cluster}`}
              </span>
            </div>
          </div>

          {event.ml_description && (
            <div className="mt-3 mb-4">
              <h4 className="text-sm font-medium text-blue-400">ML Description</h4>
              <p className="text-sm text-blue-300/70 mt-1">{event.ml_description}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 mb-3">
            {entityType === "computersimpacted" ? (
              <>
                <Monitor className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  Computer: <span className="font-mono text-blue-400">{event.computer_name}</span>
                </span>
              </>
            ) : entityType === "userorigin" ? (
              <>
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  User Origin: <span className="font-mono text-blue-400">{event.user_origin}</span>
                </span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  User Impacted: <span className="font-mono text-blue-400">{event.user_impacted}</span>
                </span>
              </>
            )}
          </div>

          <TimelineEventTimestamps
            firstTimeSeen={event.first_time_seen || ''}
            lastTimeSeen={event.last_time_seen || ''}
          />

          <TimelineMitreSection alert={event} />

          {isExpanded && detailedLogs && (
            <TimelineDetailedLogs
              logs={entityType === "computersimpacted" ? detailedLogs?.computer_impacted_logs || [] :
                   entityType === "userorigin" ? detailedLogs?.user_origin_logs || [] :
                   detailedLogs?.user_impacted_logs || []}
              isLoading={false}
              totalRecords={detailedLogs?.pagination?.total_records || 0}
              entityType={mappedEntityType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;


import { Alert } from "./types";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "./utils";
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineInstanceList from "./TimelineInstanceList";
import TimelineConnector from "./TimelineConnector";
import { useTimelineLogs } from "./hooks/useTimelineLogs";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
  isLatest?: boolean;
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  onSelect: (id: string | null) => void;
  detailedLogs?: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  instances?: Alert[];
  isLoadingLogs?: boolean;
  selectedEventId: string | null;
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
  instances = [],
  isLoadingLogs = false,
  selectedEventId
}: TimelineEventCardProps) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  // Query for logs data with enabled flag tied to expanded state
  const { data: logsData, isLoading, error } = useTimelineLogs({
    entityType,
    event,
    enabled: isDetailsExpanded // Only fetch when details are expanded
  });

  const handleCardClick = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
    onSelect(event.id);
    console.log('Card clicked:', {
      entityType,
      event,
      isExpanded: !isDetailsExpanded
    });
  };

  return (
    <div className="group relative pl-4 w-full">
      <TimelineConnector color={color} isLast={isLast} />

      <div className="relative ml-4 mb-2">
        <div 
          className={cn(
            "rounded-lg border shadow-lg cursor-pointer",
            cardBg,
            border,
            hover,
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75"
          )}
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
        >
          <div className="p-4">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex-1">
                <TimelineEventHeader
                  ruleLevel={event.rule_level}
                  totalRecords={event.total_events || 0}
                  title={event.title}
                  description={event.description}
                />
              </div>
              <ChevronDown 
                className={cn(
                  "h-5 w-5 text-purple-400 transition-transform duration-200",
                  isDetailsExpanded && "transform rotate-180"
                )} 
              />
            </div>

            <TimelineEventTimestamps
              firstSeen={event.first_time_seen || event.system_time}
              lastSeen={event.last_time_seen || event.system_time}
            />

            {event.tags && <TimelineMitreSection tags={event.tags} />}
          </div>

          {isDetailsExpanded && (
            <div className="border-t border-purple-500/20 p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { label: 'Event ID', value: event.event_id },
                    { label: 'Provider Name', value: event.provider_name },
                    { label: 'Computer Name', value: event.computer_name },
                    { label: 'Task', value: event.task },
                    { label: 'User ID', value: event.user_id },
                    { label: 'IP Address', value: event.ip_address },
                    { label: 'Risk Level', value: event.rule_level },
                    { label: 'Risk Score', value: event.risk }
                  ].map(({ label, value }) => (
                    <TableRow key={label}>
                      <TableCell className="font-medium text-purple-400">{label}</TableCell>
                      <TableCell>{value || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {isLoading ? (
                <div className="text-center py-4 text-purple-400">Loading logs...</div>
              ) : error ? (
                <div className="text-red-400 mt-4 text-center">
                  Error loading logs. Please try again.
                </div>
              ) : logsData ? (
                <div className="mt-4">
                  <h4 className="text-purple-400 font-medium mb-2">Related Logs</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(logsData) && logsData.length > 0 ? (
                        logsData.map((log: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{log.event}</TableCell>
                            <TableCell>{log.description}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">No logs available</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : null}
            </div>
          )}

          <TimelineInstanceList
            instances={instances}
            isExpanded={isExpanded || false}
            onToggle={() => onToggleExpand?.()}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;

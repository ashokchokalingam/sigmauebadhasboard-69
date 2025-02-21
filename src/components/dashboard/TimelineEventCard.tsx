
import { Alert } from "./types";
import { cn } from "@/lib/utils";
import { getRiskLevel } from "./utils"; // Add this import
import TimelineEventHeader from "./TimelineEventHeader";
import TimelineEventTimestamps from "./TimelineEventTimestamps";
import TimelineMitreSection from "./TimelineMitreSection";
import TimelineInstanceList from "./TimelineInstanceList";
import TimelineConnector from "./TimelineConnector";
import { useTimelineLogs } from "./hooks/useTimelineLogs";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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
  const isSelected = selectedEventId === event.id;
  const { color, bg, border, hover, cardBg } = getRiskLevel(event.rule_level);

  const { data: logsData, isLoading } = useTimelineLogs(
    entityType,
    event,
    isDetailsExpanded
  );

  const handleExpandClick = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  return (
    <div className="group relative pl-4 w-full">
      <TimelineConnector color={color} isLast={isLast} />

      <div className="relative ml-4 mb-2">
        <div 
          className={cn(
            "rounded-lg border shadow-lg",
            cardBg,
            border,
            hover,
            isLatest && "ring-1 ring-blue-500/50 bg-opacity-75"
          )}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpandClick}
                className="text-purple-400 hover:text-purple-300"
              >
                <ChevronDown className={cn(
                  "h-5 w-5",
                  isDetailsExpanded && "opacity-50"
                )} />
                {isDetailsExpanded ? 'Hide Details' : 'Show Details'}
              </Button>
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
                  <TableRow>
                    <TableCell className="font-medium text-purple-400">Event ID</TableCell>
                    <TableCell>{event.event_id || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-purple-400">Provider Name</TableCell>
                    <TableCell>{event.provider_name || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-purple-400">Computer Name</TableCell>
                    <TableCell>{event.computer_name || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-purple-400">Task</TableCell>
                    <TableCell>{event.task || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-purple-400">User ID</TableCell>
                    <TableCell>{event.user_id || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-purple-400">IP Address</TableCell>
                    <TableCell>{event.ip_address || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-purple-400">Risk Level</TableCell>
                    <TableCell>{event.rule_level || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-purple-400">Risk Score</TableCell>
                    <TableCell>{event.risk || 'N/A'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {isLoading ? (
                <div className="text-center py-4 text-purple-400">Loading logs...</div>
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
                      {Array.isArray(logsData) ? logsData.map((log: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{log.event}</TableCell>
                          <TableCell>{log.description}</TableCell>
                        </TableRow>
                      )) : (
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

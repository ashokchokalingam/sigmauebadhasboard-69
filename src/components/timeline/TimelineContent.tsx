import { Alert } from "@/components/dashboard/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimelineEventCard from "../dashboard/TimelineEventCard";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatInTimeZone } from 'date-fns-tz';

interface TimelineContentProps {
  allEvents: Alert[];
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  isLoading: boolean;
  hasNextPage: boolean;
  loaderRef: (node?: Element | null) => void;
}

type SortOption = "latest" | "oldest" | "severity";
type FilterOption = "all" | "critical" | "medium" | "low";

const TimelineContent = ({ 
  allEvents, 
  entityType, 
  isLoading, 
  hasNextPage,
  loaderRef 
}: TimelineContentProps) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Filter and sort events
  const processedEvents = useMemo(() => {
    let filteredEvents = allEvents;

    // Apply severity filter
    if (filterBy !== "all") {
      filteredEvents = allEvents.filter(event => {
        const severity = (event.rule_level || "").toLowerCase();
        switch (filterBy) {
          case "critical":
            return severity === "critical" || severity === "high";
          case "medium":
            return severity === "medium";
          case "low":
            return severity === "low" || severity === "informational";
          default:
            return true;
        }
      });
    }

    // Group similar events within 5-minute windows
    const groupedEvents = filteredEvents.reduce((acc: Alert[], event) => {
      const existingEvent = acc.find(e => 
        e.title === event.title && 
        e.description === event.description &&
        e.rule_level === event.rule_level &&
        Math.abs(
          new Date(e.last_time_seen || e.system_time).getTime() - 
          new Date(event.last_time_seen || event.system_time).getTime()
        ) <= 300000 // 5 minutes
      );

      if (existingEvent) {
        existingEvent.total_events = (existingEvent.total_events || 1) + 1;
        if (Array.isArray(existingEvent.instances)) {
          existingEvent.instances.push(event);
        } else {
          existingEvent.instances = [existingEvent, event];
        }
      } else {
        acc.push({
          ...event,
          total_events: 1,
          instances: [event]
        });
      }
      return acc;
    }, []);

    // Sort events
    return groupedEvents.sort((a, b) => {
      if (sortBy === "severity") {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const severityA = (a.rule_level || "low").toLowerCase();
        const severityB = (b.rule_level || "low").toLowerCase();
        
        if (severityOrder[severityA as keyof typeof severityOrder] === severityOrder[severityB as keyof typeof severityOrder]) {
          return new Date(b.last_time_seen || b.system_time).getTime() - 
                 new Date(a.last_time_seen || a.system_time).getTime();
        }
        return severityOrder[severityA as keyof typeof severityOrder] - 
               severityOrder[severityB as keyof typeof severityOrder];
      }

      const timeA = new Date(a.last_time_seen || a.system_time).getTime();
      const timeB = new Date(b.last_time_seen || b.system_time).getTime();
      return sortBy === "latest" ? timeB - timeA : timeA - timeB;
    });
  }, [allEvents, sortBy, filterBy]);

  // Query for detailed logs
  const { data: detailedLogs } = useQuery({
    queryKey: ["detailed-logs", entityType, selectedEventId],
    queryFn: async () => {
      if (!selectedEventId) return null;
      
      const selectedEvent = allEvents.find(event => event.id === selectedEventId);
      if (!selectedEvent) return null;

      const baseUrl = entityType === "computersimpacted" ? '/api/computer_impacted_logs' :
                     entityType === "userorigin" ? '/api/user_origin_logs' :
                     '/api/user_impacted_logs';
      
      const params = new URLSearchParams();
      const identifier = entityType === "computersimpacted" ? selectedEvent.computer_name :
                        entityType === "userorigin" ? selectedEvent.user_origin :
                        selectedEvent.user_impacted;
      
      if (!identifier) {
        console.error('No identifier found for detailed logs');
        return null;
      }

      params.append(
        entityType === "computersimpacted" ? 'computer_name' :
        entityType === "userorigin" ? 'user_origin' :
        'user_impacted',
        identifier
      );
      
      params.append('title', selectedEvent.title);

      console.log('Fetching detailed logs:', {
        baseUrl,
        params: params.toString()
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch detailed logs');
      }
      
      return response.json();
    },
    enabled: !!selectedEventId
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-blue-500/10 flex gap-3 items-center">
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="severity">By Severity</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterBy}
          onValueChange={(value) => setFilterBy(value as FilterOption)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="critical">Critical/High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low/Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {processedEvents.map((event, index) => (
            <TimelineEventCard
              key={`${event.id}-${index}`}
              event={event}
              isLast={index === processedEvents.length - 1}
              entityType={entityType}
              onSelect={() => setSelectedEventId(event.id)}
              detailedLogs={event.id === selectedEventId ? detailedLogs : undefined}
              isExpanded={expandedGroups.has(event.id)}
              onToggleExpand={() => {
                setExpandedGroups(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(event.id)) {
                    newSet.delete(event.id);
                  } else {
                    newSet.add(event.id);
                  }
                  return newSet;
                });
              }}
              isLatest={index === 0}
              instances={event.instances}
            />
          ))}
          
          <div ref={loaderRef}>
            {hasNextPage && (
              <div className="py-2 text-center text-sm text-blue-400/60">
                Loading more events...
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineContent;

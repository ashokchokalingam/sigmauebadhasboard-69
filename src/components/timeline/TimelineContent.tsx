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

interface GroupedEvent extends Alert {
  occurrences: number;
  instances?: Alert[];
}

type SortOption = "latest" | "oldest" | "severity";

const TimelineContent = ({ 
  allEvents, 
  entityType, 
  isLoading, 
  hasNextPage,
  loaderRef 
}: TimelineContentProps) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group and sort events
  const processedEvents = useMemo(() => {
    // First, group identical events within a 5-minute window
    const groupedEvents = allEvents.reduce((acc: GroupedEvent[], event) => {
      const eventTime = new Date(event.last_time_seen || event.system_time).getTime();
      
      const existingEvent = acc.find(e => 
        e.title === event.title && 
        e.description === event.description &&
        e.rule_level === event.rule_level &&
        e.tags === event.tags &&
        // Check if events are within 5 minutes of each other
        Math.abs(eventTime - new Date(e.last_time_seen || e.system_time).getTime()) <= 300000
      );

      if (existingEvent) {
        existingEvent.occurrences = (existingEvent.occurrences || 1) + 1;
        existingEvent.instances = [...(existingEvent.instances || []), event];
        
        // Keep the most recent timestamp
        if (new Date(event.last_time_seen || event.system_time) > 
            new Date(existingEvent.last_time_seen || existingEvent.system_time)) {
          existingEvent.last_time_seen = event.last_time_seen || event.system_time;
        }
        // Keep the earliest first_seen timestamp
        if (new Date(event.first_time_seen || event.system_time) < 
            new Date(existingEvent.first_time_seen || existingEvent.system_time)) {
          existingEvent.first_time_seen = event.first_time_seen || event.system_time;
        }
        existingEvent.total_events = (existingEvent.total_events || 1) + 1;
      } else {
        acc.push({
          ...event,
          occurrences: 1,
          total_events: event.total_events || 1,
          instances: [event]
        });
      }
      return acc;
    }, []);

    // Sort based on selected option
    return groupedEvents.sort((a, b) => {
      if (sortBy === "severity") {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const severityA = (a.rule_level || "low").toLowerCase();
        const severityB = (b.rule_level || "low").toLowerCase();
        
        if (severityOrder[severityA as keyof typeof severityOrder] === severityOrder[severityB as keyof typeof severityOrder]) {
          // If severity is the same, sort by timestamp
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
  }, [allEvents, sortBy]);

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

  const toggleGroupExpansion = (eventId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  if (isLoading && allEvents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (allEvents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">No timeline events found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-blue-500/10">
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="severity">By Severity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {processedEvents.map((event, index) => (
            <div key={`${event.id}-${index}`}>
              <TimelineEventCard
                event={{
                  ...event,
                  total_events: event.occurrences || 1
                }}
                isLast={index === processedEvents.length - 1}
                entityType={entityType}
                onSelect={() => setSelectedEventId(event.id)}
                detailedLogs={event.id === selectedEventId ? detailedLogs : undefined}
                isExpanded={expandedGroups.has(event.id)}
                onToggleExpand={() => toggleGroupExpansion(event.id)}
                instances={event.instances}
              />
            </div>
          ))}
          
          <div ref={loaderRef}>
            {hasNextPage && (
              <div className="py-4 text-center text-sm text-blue-400/60">
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

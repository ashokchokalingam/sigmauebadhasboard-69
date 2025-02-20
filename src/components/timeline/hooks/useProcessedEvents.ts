
import { Alert } from "@/components/dashboard/types";
import { useMemo } from "react";

export type SortOption = "latest" | "oldest" | "severity";
export type FilterOption = "all" | "critical" | "medium" | "low";

export const useProcessedEvents = (
  allEvents: Alert[],
  sortBy: SortOption,
  filterBy: FilterOption
) => {
  return useMemo(() => {
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
};

import { useQuery } from "@tanstack/react-query";
import { Alert } from "../types";

export const useTimelineData = (
  entityType: "user" | "computer",
  entityId: string,
  page: number = 1,
  timeframe: string = "24h"
) => {
  // Query for user origin timeline
  const { data: originTimelineData, isLoading: isLoadingOrigin } = useQuery({
    queryKey: ['timeline-origin', entityId, page, timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/user_origin_timeline?user_id=${encodeURIComponent(entityId)}&page=${page}&timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch origin timeline data');
      }
      const data = await response.json();
      console.log('Origin timeline data:', data);
      return data.user_origin_timeline_logs || [];
    },
    enabled: entityType === "user",
  });

  // Query for user impacted timeline
  const { data: impactedTimelineData, isLoading: isLoadingImpacted } = useQuery({
    queryKey: ['timeline-impacted', entityId, page, timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/user_impacted_timeline?target_user_name=${encodeURIComponent(entityId)}&page=${page}&timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch impacted timeline data');
      }
      const data = await response.json();
      console.log('Impacted timeline data:', data);
      return data.user_impacted_timeline_logs || [];
    },
    enabled: entityType === "user",
  });

  // Query for computer timeline
  const { data: computerTimelineData, isLoading: isLoadingComputer } = useQuery({
    queryKey: ['timeline-computer', entityId, page, timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/computer_impacted_timeline?computer_name=${encodeURIComponent(entityId)}&page=${page}&timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch computer timeline data');
      }
      const data = await response.json();
      console.log('Computer timeline data:', data);
      return data.computer_impacted_timeline_logs || [];
    },
    enabled: entityType === "computer",
  });

  let alerts: Alert[] = [];
  if (entityType === "user") {
    // Combine and deduplicate user origin and impacted timeline data
    const originAlerts = originTimelineData || [];
    const impactedAlerts = impactedTimelineData || [];
    
    // Create a Map to store unique alerts by ID
    const alertMap = new Map();
    
    // Add origin alerts to the map
    originAlerts.forEach((alert: Alert) => {
      alertMap.set(alert.id, { ...alert, source: 'origin' });
    });
    
    // Add impacted alerts to the map, potentially overwriting duplicates
    impactedAlerts.forEach((alert: Alert) => {
      if (!alertMap.has(alert.id)) {
        alertMap.set(alert.id, { ...alert, source: 'impacted' });
      }
    });
    
    // Convert map values back to array
    alerts = Array.from(alertMap.values());
    
    // Sort by system_time in descending order
    alerts.sort((a: Alert, b: Alert) => 
      new Date(b.system_time || '').getTime() - new Date(a.system_time || '').getTime()
    );
  } else {
    alerts = computerTimelineData || [];
  }

  const isLoading = entityType === "user" 
    ? (isLoadingOrigin || isLoadingImpacted)
    : isLoadingComputer;

  return {
    alerts,
    isLoading,
  };
};
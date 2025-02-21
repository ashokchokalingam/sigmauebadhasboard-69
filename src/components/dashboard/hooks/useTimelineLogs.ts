
import { useQuery } from "@tanstack/react-query";
import { Alert } from "../types";

type EntityType = "userorigin" | "userimpacted" | "computersimpacted";

interface TimelineLogsParams {
  entityType: EntityType;
  event: Alert;
  enabled: boolean;
}

const getApiEndpoint = (entityType: EntityType, event: Alert) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  switch (entityType) {
    case "userorigin":
      return `${baseUrl}/api/user_origin_logs?user_origin=${encodeURIComponent(event.user_id || '')}&title=${encodeURIComponent(event.title || '')}`;
    case "userimpacted":
      return `${baseUrl}/api/user_impacted_logs?user_impacted=${encodeURIComponent(event.target_user_name || '')}&title=${encodeURIComponent(event.title || '')}`;
    case "computersimpacted":
      return `${baseUrl}/api/computer_impacted_logs?computer_name=${encodeURIComponent(event.computer_name || '')}&title=${encodeURIComponent(event.title || '')}`;
    default:
      return `${baseUrl}/api/user_origin_logs`;
  }
};

export const useTimelineLogs = ({ entityType, event, enabled }: TimelineLogsParams) => {
  const fetchLogs = async () => {
    try {
      const endpoint = getApiEndpoint(entityType, event);
      console.log('Fetching logs from:', endpoint);
      console.log('Event data:', event);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Logs data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['logs', entityType, event.id],
    queryFn: fetchLogs,
    enabled: enabled,
    retry: 1,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000 // Using gcTime instead of cacheTime for garbage collection
  });
};

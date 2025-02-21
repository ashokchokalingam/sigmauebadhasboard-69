
import { useQuery } from "@tanstack/react-query";
import { Alert } from "../types";

type EntityType = "userorigin" | "userimpacted" | "computersimpacted";

interface TimelineLogsParams {
  entityType: EntityType;
  event: Alert;
  enabled: boolean;
}

const getApiEndpoint = (entityType: EntityType, event: Alert) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
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
  const endpoint = getApiEndpoint(entityType, event);
  
  return useQuery({
    queryKey: ['logs', entityType, event.id],
    queryFn: async () => {
      console.log('Fetching logs from endpoint:', endpoint);
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received logs data:', data);
      return data;
    },
    enabled: enabled,
    retry: 1,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });
};

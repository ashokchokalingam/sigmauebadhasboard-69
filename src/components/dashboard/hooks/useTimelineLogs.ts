
import { useQuery } from "@tanstack/react-query";
import { Alert } from "../types";

type EntityType = "userorigin" | "userimpacted" | "computersimpacted";

const getApiEndpoint = (entityType: EntityType, userOrigin?: string, title?: string) => {
  switch (entityType) {
    case "userorigin":
      return `/api/user_origin_logs?user_origin=${encodeURIComponent(userOrigin || '')}&title=${encodeURIComponent(title || '')}`;
    case "userimpacted":
      return "/api/user_impacted_logs";
    case "computersimpacted":
      return "/api/computer_impacted_logs";
    default:
      return "/api/user_origin_logs";
  }
};

export const useTimelineLogs = (
  entityType: EntityType,
  event: Alert,
  isEnabled: boolean
) => {
  const fetchLogs = async () => {
    const endpoint = getApiEndpoint(entityType, event.user_origin, event.title);
    if (entityType === "userorigin") {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
      return response.json();
    } else {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_origin: event.user_origin,
          title: event.title
        })
      });
      return response.json();
    }
  };

  return useQuery({
    queryKey: ['logs', entityType, event.id],
    queryFn: fetchLogs,
    enabled: isEnabled
  });
};

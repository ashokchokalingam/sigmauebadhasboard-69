import { useQuery } from "@tanstack/react-query";
import { EventSummary } from "../types";

export const useEventSummary = (
  entityType: "target" | "origin" | "computer",
  entityId: string,
  timeframe: string = "24h"
) => {
  return useQuery({
    queryKey: ['event-summary', entityType, entityId, timeframe],
    queryFn: async () => {
      let endpoint = '';
      
      switch (entityType) {
        case 'target':
          endpoint = `/api/user_impacted_timeline?target_user_name=${entityId}&timeframe=${timeframe}`;
          break;
        case 'origin':
          endpoint = `/api/user_origin_timeline?user_id=${entityId}&timeframe=${timeframe}`;
          break;
        case 'computer':
          endpoint = `/api/computer_impacted_timeline?computer_name=${entityId}&timeframe=${timeframe}`;
          break;
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch event summary');
      }

      const data = await response.json();
      console.log('Event summary data:', data);
      return data;
    },
    enabled: Boolean(entityType && entityId),
  });
};
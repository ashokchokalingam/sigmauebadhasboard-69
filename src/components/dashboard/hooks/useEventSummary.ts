import { useQuery } from "@tanstack/react-query";
import { EventSummary } from "../types";

interface EventSummaryResponse {
  event_summary: EventSummary[];
}

export const useEventSummary = (
  entityType: "user" | "computer" | "target",
  entityId: string,
  timeframe: string
) => {
  const days = timeframe === "7d" ? 7 : 1;

  const fetchEventSummary = async (): Promise<EventSummaryResponse> => {
    let endpoint = "";
    
    switch (entityType) {
      case "user":
        endpoint = `/api/event_summary_by_user?user_id=${encodeURIComponent(entityId)}&days=${days}`;
        break;
      case "target":
        endpoint = `/api/event_summary_by_target?target_user_name=${encodeURIComponent(entityId)}&days=${days}`;
        break;
      case "computer":
        endpoint = `/api/event_summary_by_computer?computer_name=${encodeURIComponent(entityId)}&days=${days}`;
        break;
    }

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch event summary');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['event-summary', entityType, entityId, timeframe],
    queryFn: fetchEventSummary,
    staleTime: 30000,
    retry: 2,
    refetchOnWindowFocus: false
  });
};
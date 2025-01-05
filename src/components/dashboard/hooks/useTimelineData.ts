import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "../types";

interface TimelineResponse {
  user_impacted_timeline_logs?: Alert[];
  computer_impacted_timeline_logs?: Alert[];
  pagination: {
    current_page: number;
    per_page: number;
  };
}

export const useTimelineData = (
  entityType: "user" | "computer",
  entityId: string,
  page: number = 1,
  timeframe: string = "24h"
) => {
  const queryClient = useQueryClient();

  const fetchTimelineData = async (pageNum: number): Promise<TimelineResponse> => {
    console.log(`Fetching timeline data for page ${pageNum}, timeframe ${timeframe}`);
    const endpoint = entityType === "user" 
      ? `/api/user_impacted_timeline?target_user_name=${encodeURIComponent(entityId)}&page=${pageNum}&per_page=100&timeframe=${timeframe}`
      : `/api/computer_impacted_timeline?computer_name=${encodeURIComponent(entityId)}&page=${pageNum}&per_page=100&timeframe=${timeframe}`;
    
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch timeline data');
    }
    const data = await response.json();
    console.log(`Received data for page ${pageNum}:`, data);
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['timeline', entityType, entityId, page, timeframe],
    queryFn: () => fetchTimelineData(page),
    staleTime: 30000,
    retry: 2,
    refetchOnWindowFocus: false
  });

  const alerts = entityType === "user" 
    ? data?.user_impacted_timeline_logs || []
    : data?.computer_impacted_timeline_logs || [];

  const hasMore = alerts.length === 100; // If we got full page, assume there's more

  return {
    alerts,
    isLoading,
    error,
    hasMore,
    currentPage: data?.pagination?.current_page || page,
  };
};
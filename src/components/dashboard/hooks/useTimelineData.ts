import { useQuery } from "@tanstack/react-query";
import { Alert } from "../types";

export const useTimelineData = (
  entityType: "user" | "computer",
  entityId: string,
  page: number = 1,
  timeframe: string = "24h"
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['timeline-impacted', entityId, page, timeframe],
    queryFn: async () => {
      console.log(`Fetching page ${page} for ${entityType} ${entityId}`);
      const response = await fetch(`/api/user_impacted_timeline?target_user_name=${encodeURIComponent(entityId)}&page=${page}&per_page=100&timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      const data = await response.json();
      console.log(`Received ${data?.user_impacted_timeline_logs?.length || 0} alerts for page ${page}`);
      return data;
    },
    staleTime: 30000, // Cache data for 30 seconds
    retry: 2,
  });

  const alerts: Alert[] = data?.user_impacted_timeline_logs || [];
  const pagination = data?.pagination || {};
  const hasMore = pagination.current_page < pagination.total_pages;

  return {
    alerts,
    isLoading,
    error,
    hasMore,
    totalPages: pagination.total_pages,
    currentPage: pagination.current_page,
  };
};
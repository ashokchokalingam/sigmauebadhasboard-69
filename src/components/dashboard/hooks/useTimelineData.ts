import { useQuery } from "@tanstack/react-query";
import { Alert } from "../types";

export const useTimelineData = (
  entityType: "user" | "computer",
  entityId: string,
  page: number = 1,
  timeframe: string = "24h"
) => {
  // Query for user impacted timeline only
  const { data: impactedTimelineData, isLoading: isLoadingImpacted } = useQuery({
    queryKey: ['timeline-impacted', entityId, page, timeframe],
    queryFn: async () => {
      console.log(`Fetching page ${page} for user ${entityId}`);
      const response = await fetch(`/api/user_impacted_timeline?target_user_name=${encodeURIComponent(entityId)}&page=${page}&per_page=5000&timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch impacted timeline data');
      }
      const data = await response.json();
      console.log(`Received data for page ${page}:`, data);
      return data;
    },
  });

  // Query for computer timeline
  const { data: computerTimelineData, isLoading: isLoadingComputer } = useQuery({
    queryKey: ['timeline-computer', entityId, page, timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/computer_impacted_timeline?computer_name=${encodeURIComponent(entityId)}&page=${page}&per_page=5000&timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch computer timeline data');
      }
      const data = await response.json();
      console.log('Computer timeline data:', data);
      return data;
    },
    enabled: entityType === "computer",
  });

  let alerts: Alert[] = [];
  let hasMore = false;

  if (entityType === "user") {
    alerts = impactedTimelineData?.user_impacted_timeline_logs || [];
    const impactedPagination = impactedTimelineData?.pagination;
    hasMore = impactedPagination?.current_page < impactedPagination?.total_pages;
  } else {
    alerts = computerTimelineData?.computer_impacted_timeline_logs || [];
    const computerPagination = computerTimelineData?.pagination;
    hasMore = computerPagination?.current_page < computerPagination?.total_pages;
  }

  return {
    alerts,
    isLoading: entityType === "user" ? isLoadingImpacted : isLoadingComputer,
    hasMore,
  };
};
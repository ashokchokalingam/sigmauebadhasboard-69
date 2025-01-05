import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "../types";
import { useEffect } from "react";

interface TimelineResponse {
  user_impacted_timeline_logs: Alert[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_records: number;
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
    const response = await fetch(
      `/api/user_impacted_timeline?target_user_name=${encodeURIComponent(entityId)}&page=${pageNum}&per_page=100&timeframe=${timeframe}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch timeline data');
    }
    const data = await response.json();
    console.log(`Received data for page ${pageNum}:`, data);
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['timeline-impacted', entityId, page, timeframe],
    queryFn: () => fetchTimelineData(page),
    staleTime: 30000,
    retry: 2
  });

  // Auto-fetch next page when current page data is received
  useEffect(() => {
    if (data?.pagination && data.pagination.current_page < data.pagination.total_pages) {
      const nextPage = data.pagination.current_page + 1;
      console.log(`Auto-fetching next page ${nextPage}`);
      queryClient.prefetchQuery({
        queryKey: ['timeline-impacted', entityId, nextPage, timeframe],
        queryFn: () => fetchTimelineData(nextPage),
        staleTime: 30000,
      });
    }
  }, [data, entityId, timeframe, queryClient]);

  const alerts: Alert[] = data?.user_impacted_timeline_logs || [];
  const pagination = data?.pagination || { current_page: 0, total_pages: 0, per_page: 100, total_records: 0 };
  const hasMore = pagination.current_page < pagination.total_pages;

  console.log('Current timeline state:', {
    page,
    hasMore,
    alertsCount: alerts.length,
    isLoading,
    currentPage: pagination.current_page,
    totalPages: pagination.total_pages
  });

  return {
    alerts,
    isLoading,
    error,
    hasMore,
    totalPages: pagination.total_pages,
    currentPage: pagination.current_page,
  };
};
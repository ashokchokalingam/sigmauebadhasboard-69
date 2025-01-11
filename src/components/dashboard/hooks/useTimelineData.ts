import { useQuery } from "@tanstack/react-query";
import { Alert } from "../types";
import { TIMELINE_LOAD_SIZE } from "@/constants/pagination";

interface TimelineResponse {
  alerts: Alert[];
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
  // Temporarily return empty data while timeline API is unavailable
  return {
    alerts: [],
    isLoading: false,
    error: null,
    hasMore: false,
    currentPage: 1,
  };
};
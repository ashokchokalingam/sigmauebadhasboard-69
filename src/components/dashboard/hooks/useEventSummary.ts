import { useQuery } from "@tanstack/react-query";
import { EventSummary } from "../types";

export const useEventSummary = (
  entityType: "target" | "user" | "computer",
  entityId: string,
  timeframe: string
) => {
  // Temporarily return empty data while API is unavailable
  return {
    data: {
      event_summary: [] as EventSummary[]
    },
    isLoading: false,
    error: null
  };
};
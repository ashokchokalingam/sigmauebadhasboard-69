import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/components/dashboard/types";
import { INITIAL_LOAD_SIZE } from "@/constants/pagination";

interface ApiResponse {
  alerts: Alert[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_records: number;
  };
}

interface FetchAlertsResponse {
  alerts: Alert[];
  totalRecords: number;
  hasMore: boolean;
  currentPage: number;
}

const isWithinLastSevenDays = (date: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(date) >= sevenDaysAgo;
};

export const useAlerts = (
  page: number = 1,
  onProgressUpdate: (alerts: Alert[], totalRecords: number) => void
) => {
  return useQuery<FetchAlertsResponse>({
    queryKey: ['alerts', page],
    queryFn: async () => {
      console.log(`Fetching alerts for page ${page}`);
      
      const response = await fetch(`/api/alerts?page=${page}&per_page=${INITIAL_LOAD_SIZE}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Server response error:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      // Get all alerts within the last 7 days
      const filteredAlerts = data.alerts.filter(alert => isWithinLastSevenDays(alert.system_time));
      
      // Update UI with current data
      onProgressUpdate(filteredAlerts, data.pagination.total_records);
      
      return {
        alerts: filteredAlerts,
        totalRecords: data.pagination.total_records,
        hasMore: page < data.pagination.total_pages,
        currentPage: page
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    meta: {
      onError: (error: Error) => {
        console.error("Failed to fetch alerts:", error);
      }
    }
  });
};
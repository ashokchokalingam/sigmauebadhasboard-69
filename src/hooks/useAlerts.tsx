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
      
      // First, get the total count for the last 7 days
      const countResponse = await fetch('/api/alerts/count', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!countResponse.ok) {
        throw new Error(`HTTP error! status: ${countResponse.status}`);
      }
      
      const { total_records } = await countResponse.json();
      console.log('Total records in last 7 days:', total_records);
      
      // Then fetch the paginated data for the table
      const response = await fetch(`/api/alerts?page=${page}&per_page=${INITIAL_LOAD_SIZE}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      // Get all alerts within the last 7 days
      const filteredAlerts = data.alerts.filter(alert => isWithinLastSevenDays(alert.system_time));
      
      // Update UI with current data and the actual total count
      onProgressUpdate(filteredAlerts, total_records);
      
      return {
        alerts: filteredAlerts,
        totalRecords: total_records, // Use the actual total count
        hasMore: page < Math.ceil(total_records / INITIAL_LOAD_SIZE),
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
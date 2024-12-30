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
  total_count: number; // This should match the COUNT(*) from sigma_alerts
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
      
      // Fetch paginated data for the table and total count from sigma_alerts
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
      console.log('Received data:', data);
      
      // Get all alerts within the last 7 days
      const filteredAlerts = data.alerts.filter(alert => isWithinLastSevenDays(alert.system_time));
      
      // Use the total_count from the API response (this should match SELECT COUNT(*) FROM sigma_alerts)
      const totalRecords = data.total_count;
      console.log('Total records from sigma_alerts:', totalRecords);
      
      // Update UI with current data
      onProgressUpdate(filteredAlerts, totalRecords);
      
      return {
        alerts: filteredAlerts,
        totalRecords: totalRecords,
        hasMore: page < Math.ceil(totalRecords / INITIAL_LOAD_SIZE),
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
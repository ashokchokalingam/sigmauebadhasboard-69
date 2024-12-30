import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/components/dashboard/types";
import { ALERTS_PER_PAGE } from "@/constants/pagination";

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
}

const isWithinLastSevenDays = (date: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(date) >= sevenDaysAgo;
};

export const useAlerts = (
  onProgressUpdate: (alerts: Alert[], totalRecords: number) => void
) => {
  return useQuery<FetchAlertsResponse>({
    queryKey: ['alerts'],
    queryFn: async () => {
      console.log('Fetching all alerts');
      let allAlerts: Alert[] = [];
      let currentPage = 1;
      let totalRecords = 0;
      
      while (true) {
        const response = await fetch(`/api/alerts?page=${currentPage}&per_page=${ALERTS_PER_PAGE}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        console.log(`Fetching page ${currentPage}, Response status:`, response.status);
        
        if (!response.ok) {
          console.error('Server response error:', response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        // Filter alerts based on date for caching
        const newAlerts = data.alerts.filter(alert => isWithinLastSevenDays(alert.system_time));
        allAlerts = [...allAlerts, ...newAlerts];
        totalRecords = data.pagination.total_records;
        
        // Update UI with current data
        onProgressUpdate(allAlerts, totalRecords);
        
        // Check if we've reached the last page
        if (currentPage >= data.pagination.total_pages) {
          console.log(`Total records in database: ${totalRecords}`);
          return { alerts: allAlerts, totalRecords };
        }
        
        currentPage++;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000,   // Keep unused data in cache for 30 minutes
    meta: {
      onError: (error: Error) => {
        console.error("Failed to fetch alerts:", error);
      }
    }
  });
};
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/components/dashboard/types";
import { INITIAL_LOAD_SIZE } from "@/constants/pagination";
import { useToast } from "@/components/ui/use-toast";

interface ApiResponse {
  alerts: {
    system_time: string;
    title: string;
    description: string;
    computer_name: string;
    user_id: string;
    event_id: string;
    provider_name: string;
    dbscan_cluster: number;
    ip_address: string;
    ruleid: string;
    rule_level: string;
    task: string;
    target_user_name: string;
    target_domain_name: string;
    tags: string[];
  }[];
  pagination: {
    current_page: number;
    per_page: number;
    total_records: number;
    total_pages: number;
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
  const { toast } = useToast();

  return useQuery<FetchAlertsResponse>({
    queryKey: ['alerts', page],
    queryFn: async () => {
      console.log(`Fetching alerts for page ${page}`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(`/api/alerts?page=${page}&per_page=${INITIAL_LOAD_SIZE}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        console.log('Received data:', data);
        
        // Convert the API response to our frontend Alert type
        const alerts: Alert[] = data.alerts.map(alert => ({
          id: crypto.randomUUID(),
          ...alert
        }));
        
        // Filter alerts within the last 7 days
        const filteredAlerts = alerts.filter(alert => isWithinLastSevenDays(alert.system_time));
        
        // Update UI with current data
        onProgressUpdate(filteredAlerts, data.pagination.total_records);
        
        return {
          alerts: filteredAlerts,
          totalRecords: data.pagination.total_records,
          hasMore: page < data.pagination.total_pages,
          currentPage: page
        };
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            toast({
              title: "Connection Timeout",
              description: "The request took too long to complete. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Connection Error",
              description: "Failed to connect to the server. Please check your connection.",
              variant: "destructive",
            });
          }
          console.error('Error fetching alerts:', error);
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
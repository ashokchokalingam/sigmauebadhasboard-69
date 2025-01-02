import { useQuery } from "@tanstack/react-query";
import { Alert } from "@/components/dashboard/types";
import { INITIAL_LOAD_SIZE } from "@/constants/pagination";
import { useToast } from "@/components/ui/use-toast";

interface ApiResponse {
  alerts: {
    system_time: string;
    title: string;
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
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`/api/alerts?page=${page}&per_page=${INITIAL_LOAD_SIZE}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        console.log('Received data:', data);
        
        // Convert the simplified API response to our frontend Alert type
        const alerts: Alert[] = data.alerts.map(alert => ({
          id: crypto.randomUUID(),
          system_time: alert.system_time,
          title: alert.title,
          tags: null,
          description: null,
          computer_name: null,
          user_id: null,
          event_id: null,
          provider_name: null,
          dbscan_cluster: null,
          raw: null,
          ip_address: null,
          ruleid: null,
          rule_level: null,
          task: null,
          target_user_name: null,
          target_domain_name: null
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
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
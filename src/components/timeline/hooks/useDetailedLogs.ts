
import { Alert } from "@/components/dashboard/types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDetailedLogs = (
  selectedEventId: string | null,
  entityType: "userorigin" | "userimpacted" | "computersimpacted",
  allEvents: Alert[]
) => {
  return useQuery({
    queryKey: ["detailed-logs", entityType, selectedEventId],
    queryFn: async () => {
      console.log('queryFn executing with:', { selectedEventId, entityType });

      if (!selectedEventId) {
        return null;
      }
      
      const selectedEvent = allEvents.find(event => event.id === selectedEventId);
      if (!selectedEvent) {
        return null;
      }

      let endpoint = '/api/user_origin_logs';
      const params = new URLSearchParams();

      if (entityType === "userorigin") {
        if (!selectedEvent.user_origin || !selectedEvent.title) {
          toast.error("Missing required parameters");
          return null;
        }

        params.append("user_origin", selectedEvent.user_origin);
        params.append("title", selectedEvent.title);
      } else {
        endpoint = entityType === "computersimpacted" 
          ? '/api/computer_impacted_logs'
          : '/api/user_impacted_logs';

        const paramKey = entityType === "computersimpacted" 
          ? "computer_name" 
          : "user_impacted";
        
        const paramValue = entityType === "computersimpacted"
          ? selectedEvent.computer_name
          : selectedEvent.user_impacted;

        if (!paramValue) {
          toast.error("Missing required parameters");
          return null;
        }

        params.append(paramKey, paramValue);
        params.append("title", selectedEvent.title || '');
      }

      const url = `${endpoint}?${params.toString()}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }
        const data = await response.json();
        return entityType === "userorigin" ? data.user_origin_logs : data;
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast.error("Failed to fetch detailed logs");
        throw error;
      }
    },
    enabled: !!selectedEventId,
    meta: {
      onSettled: (data, error) => {
        console.log('Query settled:', { hasData: !!data, error });
      }
    }
  });
};

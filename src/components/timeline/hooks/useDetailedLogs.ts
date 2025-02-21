
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

      let endpoint = '/api/user_impacted_logs';
      const params = new URLSearchParams();

      switch (entityType) {
        case "userimpacted":
          if (!selectedEvent.user_impacted) {
            toast.error("Missing user_impacted parameter");
            return null;
          }
          params.append("user_impacted", selectedEvent.user_impacted);
          break;

        case "userorigin":
          endpoint = '/api/user_origin_logs';
          if (!selectedEvent.user_origin) {
            toast.error("Missing user_origin parameter");
            return null;
          }
          params.append("user_origin", selectedEvent.user_origin);
          break;

        case "computersimpacted":
          endpoint = '/api/computer_impacted_logs';
          if (!selectedEvent.computer_name) {
            toast.error("Missing computer_name parameter");
            return null;
          }
          params.append("computer_name", selectedEvent.computer_name);
          break;
      }

      // Add title parameter if available
      if (selectedEvent.title) {
        params.append("title", selectedEvent.title);
      }

      const url = `${endpoint}?${params.toString()}`;
      console.log('Fetching logs from:', url);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Logs fetched successfully:', data);

        // Return the appropriate data based on entity type
        switch (entityType) {
          case "userimpacted":
            return data.user_impacted_logs || [];
          case "userorigin":
            return data.user_origin_logs || [];
          case "computersimpacted":
            return data.computer_impacted_logs || [];
          default:
            return [];
        }
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

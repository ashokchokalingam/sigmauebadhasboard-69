
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
      console.log('queryFn executing with:', { selectedEventId, entityType, allEvents });

      if (!selectedEventId) {
        console.log('No selectedEventId, returning null');
        return null;
      }
      
      const selectedEvent = allEvents.find(event => event.id === selectedEventId);
      if (!selectedEvent) {
        console.log('No matching event found in allEvents:', { selectedEventId, allEvents });
        return null;
      }

      console.log('Selected event:', selectedEvent);
      let endpoint = '/api/user_impacted_logs';
      const params = new URLSearchParams();

      switch (entityType) {
        case "userimpacted":
          endpoint = '/api/computer_impacted_logs';
          if (!selectedEvent.computer_name) {
            console.error('Missing computer_name for event:', selectedEvent);
            toast.error("Missing computer_name parameter");
            return null;
          }
          params.append("computer_name", selectedEvent.computer_name);
          break;

        case "userorigin":
          endpoint = '/api/user_origin_logs';
          if (!selectedEvent.user_origin) {
            console.error('Missing user_origin for event:', selectedEvent);
            toast.error("Missing user_origin parameter");
            return null;
          }
          params.append("user_origin", selectedEvent.user_origin);
          break;

        case "computersimpacted":
          endpoint = '/api/computer_impacted_logs';
          if (!selectedEvent.computer_name) {
            console.error('Missing computer_name for event:', selectedEvent);
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
      console.log('Attempting to fetch logs from:', url);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText);
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Logs fetched successfully:', data);

        // Return appropriate data based on entity type
        const logs = entityType === "userimpacted" ? data.computer_impacted_logs :
                    entityType === "userorigin" ? data.user_origin_logs :
                    data.computer_impacted_logs;
                    
        console.log('Returning logs:', logs);
        return logs || [];

      } catch (error) {
        console.error('Error fetching logs:', error);
        toast.error("Failed to fetch detailed logs");
        throw error;
      }
    },
    enabled: !!selectedEventId && !!allEvents?.length,
    refetchOnWindowFocus: false
  });
};

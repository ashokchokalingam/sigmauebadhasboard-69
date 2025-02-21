
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
      console.log('Fetching detailed logs:', { selectedEventId, entityType });

      if (!selectedEventId) {
        return null;
      }
      
      const selectedEvent = allEvents.find(event => event.id === selectedEventId);
      if (!selectedEvent) {
        return null;
      }

      // Determine the correct API endpoint and parameters based on entity type
      const endpoints = {
        userorigin: '/api/user_origin_timeline',
        userimpacted: '/api/user_impacted_timeline',
        computersimpacted: '/api/computer_impacted_timeline'
      };

      const paramMappings = {
        userorigin: {
          key: 'user_origin',
          value: selectedEvent.user_origin
        },
        userimpacted: {
          key: 'user_impacted',
          value: selectedEvent.user_impacted
        },
        computersimpacted: {
          key: 'computer_name',
          value: selectedEvent.computer_name
        }
      };

      const endpoint = endpoints[entityType];
      const { key, value } = paramMappings[entityType];

      if (!value) {
        toast.error("Missing required entity identifier");
        return null;
      }

      const params = new URLSearchParams();
      params.append(key, value);
      
      if (selectedEvent.title) {
        params.append("title", selectedEvent.title);
      }

      const url = `${endpoint}?${params.toString()}`;
      console.log('Fetching logs from:', url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Logs fetched successfully:', data);
        
        // Map the response based on entity type
        const responseMapping = {
          userorigin: data.user_origin_timeline,
          userimpacted: data.user_impacted_timeline,
          computersimpacted: data.computer_impacted_timeline
        };

        return responseMapping[entityType] || [];
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

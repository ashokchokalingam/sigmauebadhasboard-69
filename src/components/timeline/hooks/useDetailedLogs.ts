
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

      // For timeline view, use timeline endpoints
      const timelineEndpoints = {
        userorigin: '/api/user_origin_timeline',
        userimpacted: '/api/user_impacted_timeline',
        computersimpacted: '/api/computer_impacted_timeline'
      };

      // For detailed logs, use logs endpoints
      const logEndpoints = {
        userorigin: '/api/user_origin_logs',
        userimpacted: '/api/user_impacted_logs',
        computersimpacted: '/api/computer_impacted_logs'
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

      const timelineEndpoint = timelineEndpoints[entityType];
      const logEndpoint = logEndpoints[entityType];
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

      // Fetch both timeline and detailed logs
      try {
        const [timelineResponse, logsResponse] = await Promise.all([
          fetch(`${timelineEndpoint}?${params.toString()}`),
          fetch(`${logEndpoint}?${params.toString()}`)
        ]);

        if (!timelineResponse.ok || !logsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const timelineData = await timelineResponse.json();
        const logsData = await logsResponse.json();

        console.log('Data fetched successfully:', { timelineData, logsData });
        
        // Combine timeline and logs data
        return {
          timeline: timelineData[`${entityType}_timeline`] || [],
          logs: logsData[`${entityType}_logs`] || []
        };

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to fetch timeline and logs data");
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

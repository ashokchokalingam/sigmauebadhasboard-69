import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export const useTimelineData = (entityType: "user" | "computer", entityId: string, page: number) => {
  const { toast } = useToast();

  // Query for user origin timeline
  const { data: originTimelineData, isLoading: isLoadingOrigin } = useQuery({
    queryKey: ['timeline-origin', entityId, page],
    queryFn: async () => {
      const response = await fetch(`/api/user_origin_timeline?user_id=${encodeURIComponent(entityId)}&page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch origin timeline data');
      }
      return response.json();
    },
    enabled: entityType === "user",
    meta: {
      onError: (error: Error) => {
        console.error('Origin timeline fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch origin timeline data.",
          variant: "destructive",
        });
      }
    }
  });

  // Query for user impacted timeline
  const { data: impactedTimelineData, isLoading: isLoadingImpacted } = useQuery({
    queryKey: ['timeline-impacted', entityId, page],
    queryFn: async () => {
      const response = await fetch(`/api/user_impacted_timeline?target_user_name=${encodeURIComponent(entityId)}&page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch impacted timeline data');
      }
      return response.json();
    },
    enabled: entityType === "user",
    meta: {
      onError: (error: Error) => {
        console.error('Impacted timeline fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch impacted timeline data.",
          variant: "destructive",
        });
      }
    }
  });

  // Query for computer timeline
  const { data: computerTimelineData, isLoading: isLoadingComputer } = useQuery({
    queryKey: ['timeline-computer', entityId, page],
    queryFn: async () => {
      const response = await fetch(`/api/computer_impacted_timeline?computer_name=${encodeURIComponent(entityId)}&page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch computer timeline data');
      }
      return response.json();
    },
    enabled: entityType === "computer",
    meta: {
      onError: (error: Error) => {
        console.error('Computer timeline fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch computer timeline data.",
          variant: "destructive",
        });
      }
    }
  });

  const alerts = entityType === "user"
    ? [
        ...(originTimelineData?.user_origin_timeline_logs || []),
        ...(impactedTimelineData?.user_impacted_timeline_logs || [])
      ]
    : computerTimelineData?.computer_impacted_timeline_logs || [];

  const isLoading = entityType === "user" 
    ? (isLoadingOrigin || isLoadingImpacted)
    : isLoadingComputer;

  return { alerts, isLoading };
};
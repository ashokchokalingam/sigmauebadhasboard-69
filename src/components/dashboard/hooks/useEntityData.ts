import { useQuery } from "@tanstack/react-query";
import { UserData, ComputerData } from "../types/entity";

export const useEntityData = (type: "users-origin" | "users-impacted" | "computers") => {
  const { data: originUsers, isLoading: isLoadingOrigin } = useQuery({
    queryKey: ['userOrigin'],
    queryFn: async () => {
      const response = await fetch('/api/user_origin');
      if (!response.ok) {
        throw new Error('Failed to fetch origin users');
      }
      const data = await response.json();
      console.log('Origin users:', data);
      return data.user_origin_logs || [];
    },
    enabled: type === "users-origin"
  });

  const { data: impactedUsers, isLoading: isLoadingImpacted } = useQuery({
    queryKey: ['userImpacted'],
    queryFn: async () => {
      const response = await fetch('/api/user_impacted');
      if (!response.ok) {
        throw new Error('Failed to fetch impacted users');
      }
      const data = await response.json();
      console.log('Impacted users:', data);
      return data.user_impacted_logs || [];
    },
    enabled: type === "users-impacted"
  });

  const { data: impactedComputers, isLoading: isLoadingComputers } = useQuery({
    queryKey: ['computerImpacted'],
    queryFn: async () => {
      const response = await fetch('/api/computer_impacted');
      if (!response.ok) {
        throw new Error('Failed to fetch impacted computers');
      }
      const data = await response.json();
      console.log('Impacted computers:', data);
      return data.computer_impacted_logs || [];
    },
    enabled: type === "computers"
  });

  return {
    originUsers,
    impactedUsers,
    impactedComputers,
    isLoadingOrigin,
    isLoadingImpacted,
    isLoadingComputers
  };
};
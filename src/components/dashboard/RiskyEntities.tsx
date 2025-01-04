import { useQuery } from "@tanstack/react-query";
import EntityHeader from "./EntityHeader";
import { Alert } from "./types";
import { sanitizeEntityName } from "./utils";
import EntitySearchInput from "./EntitySearchInput";
import EntityList from "./EntityList";
import { useEntitySearch } from "./hooks/useEntitySearch";

interface UserData {
  user_impacted: string;
  total_events: number;
  unique_anomalies: number;
}

interface ComputerData {
  computer_name: string;
  total_events: number;
  unique_anomalies: number;
}

interface RiskyEntitiesProps {
  alerts: Alert[];
  type: "users" | "computers";
  onEntitySelect: (entityId: string) => void;
}

const RiskyEntities = ({ alerts, type, onEntitySelect }: RiskyEntitiesProps) => {
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
    enabled: type === "users"
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
    enabled: type === "users"
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

  const normalizeComputerName = (name: string): string => {
    return name.replace(/\s+/g, '');
  };

  const aggregateComputerData = (computers: ComputerData[]): ComputerData[] => {
    const computerMap = new Map<string, ComputerData>();
    
    computers?.forEach((computer) => {
      const normalizedName = normalizeComputerName(computer.computer_name);
      
      if (computerMap.has(normalizedName)) {
        const existing = computerMap.get(normalizedName)!;
        computerMap.set(normalizedName, {
          computer_name: normalizedName,
          total_events: existing.total_events + computer.total_events,
          unique_anomalies: Math.max(existing.unique_anomalies, computer.unique_anomalies)
        });
      } else {
        computerMap.set(normalizedName, {
          computer_name: normalizedName,
          total_events: computer.total_events,
          unique_anomalies: computer.unique_anomalies
        });
      }
    });

    return Array.from(computerMap.values());
  };

  const getUniqueEntities = () => {
    if (type === "users") {
      const combinedUsers = new Map<string, { id: string; eventCount: number; uniqueTitles: number }>();
      
      if (impactedUsers?.length) {
        impactedUsers.forEach((user: UserData) => {
          if (!user.user_impacted || user.user_impacted.trim() === '') return;
          const entityId = sanitizeEntityName(user.user_impacted);
          
          combinedUsers.set(entityId, {
            id: entityId,
            eventCount: user.total_events,
            uniqueTitles: user.unique_anomalies
          });
        });
      }

      if (originUsers?.length) {
        originUsers.forEach((user: UserData) => {
          if (!user.user_impacted || user.user_impacted.trim() === '') return;
          const entityId = sanitizeEntityName(user.user_impacted);
          
          if (combinedUsers.has(entityId)) {
            const existing = combinedUsers.get(entityId)!;
            combinedUsers.set(entityId, {
              ...existing,
              eventCount: existing.eventCount + user.total_events,
              uniqueTitles: Math.max(existing.uniqueTitles, user.unique_anomalies)
            });
          } else {
            combinedUsers.set(entityId, {
              id: entityId,
              eventCount: user.total_events,
              uniqueTitles: user.unique_anomalies
            });
          }
        });
      }

      return Array.from(combinedUsers.values());
    } else {
      if (impactedComputers) {
        const aggregatedComputers = aggregateComputerData(impactedComputers);
        return aggregatedComputers.map(computer => ({
          id: computer.computer_name,
          eventCount: computer.total_events,
          uniqueTitles: computer.unique_anomalies
        }));
      }
      return [];
    }
  };

  const entities = getUniqueEntities()
    .sort((a, b) => b.uniqueTitles - a.uniqueTitles);

  const { searchQuery, setSearchQuery, filteredEntities } = useEntitySearch(entities);

  if (type === "users" && (isLoadingOrigin || isLoadingImpacted)) {
    return (
      <div className="space-y-4">
        <EntityHeader totalEntities={0} isLoading={true} type={type} />
        <div className="text-center text-blue-400/60 py-6 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (type === "computers" && isLoadingComputers) {
    return (
      <div className="space-y-4">
        <EntityHeader totalEntities={0} isLoading={true} type={type} />
        <div className="text-center text-blue-400/60 py-6 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EntityHeader 
        totalEntities={entities.length} 
        isLoading={isLoadingOrigin || isLoadingImpacted || isLoadingComputers}
        type={type}
      />
      
      <EntitySearchInput
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <EntityList
        entities={filteredEntities}
        onEntitySelect={onEntitySelect}
      />
    </div>
  );
};

export default RiskyEntities;
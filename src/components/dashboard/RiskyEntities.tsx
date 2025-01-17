import { Alert } from "./types";
import EntityHeader from "./EntityHeader";
import EntitySearchInput from "./EntitySearchInput";
import EntityCard from "./EntityCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";

interface RiskyEntitiesProps {
  alerts: Alert[];
  type: "users-origin" | "users-impacted" | "computers";
  onEntitySelect: (entityId: string) => void;
}

interface RiskUser {
  user: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
}

const RiskyEntities = ({ type, onEntitySelect }: RiskyEntitiesProps) => {
  const { data: riskyUsers, isLoading } = useQuery({
    queryKey: ['riskyUsers', type],
    queryFn: async () => {
      const response = await fetch('/api/user_origin_outlier_highrisk');
      if (!response.ok) {
        throw new Error('Failed to fetch risky users');
      }
      const data = await response.json();
      return data.user_origin_outlier_highrisk_logs || [];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-purple-100 flex items-center gap-2">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EntityHeader 
        totalEntities={riskyUsers?.length || 0} 
        isLoading={isLoading}
        type={type}
      />
      
      <EntitySearchInput
        searchQuery=""
        onSearchChange={() => {}}
      />
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-3 pr-4">
          {(riskyUsers || []).map((user: RiskUser) => (
            <EntityCard
              key={user.user}
              id={user.user}
              uniqueTitles={user.unique_title_count}
              riskScore={user.cumulative_risk_score}
              tacticsCount={user.unique_tactics_count}
              uniqueOutliers={user.unique_outliers}
              onClick={() => onEntitySelect(user.user)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RiskyEntities;
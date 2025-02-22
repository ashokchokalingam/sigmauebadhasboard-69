
import { Database, Users, Monitor, AlertTriangle, UserCog } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "./StatsCard";
import { Stats } from "./types";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

interface TotalCountResponse {
  critical_count: string;
  high_count: string;
  total_count: number;
}

interface UserCountsResponse {
  user_impacted_count: number;
  user_origin_count: number;
}

interface ComputerCountResponse {
  computer_count: number;
}

interface RiskyEntitiesResponse {
  total_risky_users: number;
  total_risky_computers: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  const { data: totalCountData } = useQuery({
    queryKey: ["total-count"],
    queryFn: async () => {
      const response = await fetch("/api/total_count");
      if (!response.ok) {
        throw new Error("Failed to fetch total count");
      }
      const data = await response.json();
      return data as TotalCountResponse;
    },
    refetchInterval: 30000,
  });

  const { data: userCountsData } = useQuery({
    queryKey: ["user-counts"],
    queryFn: async () => {
      const response = await fetch("/api/user_counts");
      if (!response.ok) {
        throw new Error("Failed to fetch user counts");
      }
      const data = await response.json();
      return data as UserCountsResponse;
    },
    refetchInterval: 30000,
  });

  const { data: computerCountData } = useQuery({
    queryKey: ["computer-count"],
    queryFn: async () => {
      const response = await fetch("/api/computer_count");
      if (!response.ok) {
        throw new Error("Failed to fetch computer count");
      }
      const data = await response.json();
      return data as ComputerCountResponse;
    },
    refetchInterval: 30000,
  });

  const { data: riskyEntitiesData } = useQuery({
    queryKey: ["risky-entities"],
    queryFn: async () => {
      const response = await fetch("/api/risky_entities_count");
      if (!response.ok) {
        throw new Error("Failed to fetch risky entities count");
      }
      const data = await response.json();
      return data as RiskyEntitiesResponse;
    },
    refetchInterval: 30000,
  });

  // Parse string values to numbers and use safe defaults
  const criticalCount = totalCountData ? parseInt(totalCountData.critical_count) || 0 : 0;
  const highCount = totalCountData ? parseInt(totalCountData.high_count) || 0 : 0;
  const totalCount = totalCountData?.total_count ?? totalAlerts;

  const totalUsers = (userCountsData?.user_impacted_count ?? 0) + (userCountsData?.user_origin_count ?? 0);
  const computerCount = computerCountData?.computer_count ?? 0;
  const riskyUsersCount = riskyEntitiesData?.total_risky_users ?? 0;
  const riskyComputersCount = riskyEntitiesData?.total_risky_computers ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        title="Total Events (24h)"
        value={totalCount}
        icon={Database}
        subtitle="Total events in last 24 hours"
        breakdown={[
          { rule_level: "Critical", event_count: criticalCount },
          { rule_level: "High", event_count: highCount },
        ]}
      />
      <StatsCard
        title="Active Users (24h)"
        value={totalUsers}
        icon={Users}
        subtitle="Total active users"
        breakdown={[
          { rule_level: "Origin", event_count: userCountsData?.user_origin_count ?? 0 },
          { rule_level: "Impacted", event_count: userCountsData?.user_impacted_count ?? 0 },
        ]}
      />
      <StatsCard
        title="Active Computers (24h)"
        value={computerCount}
        icon={Monitor}
        subtitle={`${computerCount} unique ${computerCount === 1 ? 'system' : 'systems'}`}
        breakdown={[
          { rule_level: "Systems", event_count: computerCount }
        ]}
      />
      <StatsCard
        title="ML Outliers (24h)"
        value={stats?.anomalies?.current ?? 0}
        icon={AlertTriangle}
        subtitle="Total outliers detected"
      />
      <StatsCard
        title="Risky Users (24h)"
        value={riskyUsersCount}
        icon={UserCog}
        subtitle="High risk users detected"
        breakdown={[
          { rule_level: "Users", event_count: riskyUsersCount },
          { rule_level: "Systems", event_count: riskyComputersCount },
        ]}
      />
    </div>
  );
};

export default StatsSection;

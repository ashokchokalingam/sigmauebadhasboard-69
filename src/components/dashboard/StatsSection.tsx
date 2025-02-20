
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

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  const highRiskUsers = stats?.uniqueUsers?.users?.filter(user => (user?.risk_score ?? 0) > 80)?.length ?? 0;
  
  const { data: totalCountData, error } = useQuery({
    queryKey: ["total-count"],
    queryFn: async () => {
      const response = await fetch("/api/total_count");
      if (!response.ok) {
        throw new Error("Failed to fetch total count");
      }
      const data = await response.json();
      return data as TotalCountResponse;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
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
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Parse string values to numbers and use safe defaults
  const criticalCount = totalCountData ? parseInt(totalCountData.critical_count) || 0 : 0;
  const highCount = totalCountData ? parseInt(totalCountData.high_count) || 0 : 0;
  const totalCount = totalCountData?.total_count ?? totalAlerts;

  const totalUsers = (userCountsData?.user_impacted_count ?? 0) + (userCountsData?.user_origin_count ?? 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6 rounded-xl 
    bg-[#15161E] shadow-2xl border border-[#5856D6]/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5856D6]/10 via-[#5856D6]/5 to-transparent pointer-events-none" />
      <StatsCard
        title="Total Events (24h)"
        value={totalCount}
        icon={Database}
        subtitle="Total events in last 24 hours"
        subtitleIcon={AlertTriangle}
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
        subtitleIcon={Users}
        breakdown={[
          { rule_level: "Impacted", event_count: userCountsData?.user_impacted_count ?? 0 },
          { rule_level: "Origin", event_count: userCountsData?.user_origin_count ?? 0 },
        ]}
      />
      <StatsCard
        title="Active Computers (24h)"
        value={stats?.uniqueComputers?.current ?? 0}
        icon={Monitor}
        subtitle={`${stats?.uniqueComputers?.computers?.length ?? 0} unique systems`}
        subtitleIcon={Monitor}
      />
      <StatsCard
        title="ML Outliers (24h)"
        value={stats?.anomalies?.current ?? 0}
        icon={AlertTriangle}
        subtitle="Total outliers detected"
        subtitleIcon={AlertTriangle}
      />
      <StatsCard
        title="Risky Users (24h)"
        value={highRiskUsers}
        icon={UserCog}
        subtitle="High risk users detected"
        subtitleIcon={AlertTriangle}
      />
    </div>
  );
};

export default StatsSection;

import { Activity, AlertTriangle, Database, Monitor, Network, Shield, Users } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";
import { useQuery } from "@tanstack/react-query";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  const { data: totalCount, isLoading } = useQuery({
    queryKey: ['totalCount'],
    queryFn: async () => {
      const response = await fetch('/api/total_count');
      if (!response.ok) {
        throw new Error('Failed to fetch total count');
      }
      const data = await response.json();
      return data.total_count || 0;  // Changed from data.count to data.total_count to match API response
    },
    initialData: 0,
  });

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Events (24h)"
        value={isLoading ? "Loading..." : totalCount}
        icon={Database}
        subtitle={`${stats.severity?.critical || 0} Critical, ${stats.severity?.high || 0} High`}
        subtitleIcon={AlertTriangle}
      />
      <StatsCard
        title="Active Users (24h)"
        value={stats.uniqueUsers?.current?.toString() || '0'}
        icon={Users}
        subtitle={`${stats.uniqueUsers?.users?.length || 0} unique users`}
        subtitleIcon={Activity}
      />
      <StatsCard
        title="Active Computers (24h)"
        value={stats.uniqueComputers?.current?.toString() || '0'}
        icon={Monitor}
        subtitle={`${stats.uniqueComputers?.computers?.length || 0} unique systems`}
        subtitleIcon={Activity}
      />
      <StatsCard
        title="Unique IPs (24h)"
        value={stats.uniqueIPs?.toString() || '0'}
        icon={Network}
        subtitle="Active in last 24 hours"
        subtitleIcon={Activity}
      />
      <StatsCard
        title="Risk Score (24h)"
        value={(stats.riskScore?.current || 0).toFixed(1)}
        icon={Shield}
        subtitle="Average risk score"
        subtitleIcon={Activity}
      />
      <StatsCard
        title="Anomalies (24h)"
        value={stats.anomalies?.current?.toString() || '0'}
        icon={AlertTriangle}
        subtitle="Total anomalies detected"
        subtitleIcon={Activity}
      />
      <StatsCard
        title="Medium Events (24h)"
        value={stats.severity?.medium?.toString() || '0'}
        icon={Activity}
        subtitle={`${stats.severity?.low || 0} Low Severity Events`}
        subtitleIcon={Activity}
      />
      <StatsCard
        title="High/Critical (24h)"
        value={((stats.severity?.high || 0) + (stats.severity?.critical || 0)).toString()}
        icon={AlertTriangle}
        subtitle={`${stats.severity?.critical || 0} Critical, ${stats.severity?.high || 0} High`}
        subtitleIcon={AlertTriangle}
      />
    </div>
  );
};

export default StatsSection;
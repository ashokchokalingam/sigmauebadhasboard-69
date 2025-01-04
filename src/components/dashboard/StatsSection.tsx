import { Activity, AlertTriangle, Database, Monitor, Users } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";
import { useQuery } from "@tanstack/react-query";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  const { data: totalCountData, isLoading } = useQuery({
    queryKey: ['total_count'],
    queryFn: async () => {
      const response = await fetch('/api/total_count');
      if (!response.ok) {
        throw new Error('Failed to fetch total count');
      }
      const data = await response.json();
      return data.total_count;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  if (!stats) {
    return null;
  }

  // Use the totalCountData directly from the API response
  const totalEvents = totalCountData || 0;
  const criticalEvents = stats.severity?.critical || 0;
  const highEvents = stats.severity?.high || 0;

  const breakdown = [
    { rule_level: 'Critical', event_count: criticalEvents },
    { rule_level: 'High', event_count: highEvents },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Events (24h)"
        value={isLoading ? "Loading..." : totalEvents}
        icon={Database}
        subtitle="Total events in last 24 hours"
        subtitleIcon={AlertTriangle}
        breakdown={breakdown}
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
        title="Anomalies (24h)"
        value={stats.anomalies?.current?.toString() || '0'}
        icon={AlertTriangle}
        subtitle="Total anomalies detected"
        subtitleIcon={Activity}
      />
    </div>
  );
};

export default StatsSection;
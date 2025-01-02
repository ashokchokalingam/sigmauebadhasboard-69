import { Activity, AlertTriangle, Database, Monitor, Users } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";
import { useQuery } from "@tanstack/react-query";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  const { data: totalCount } = useQuery({
    queryKey: ['totalCount'],
    queryFn: async () => {
      const response = await fetch('/api/total_count');
      if (!response.ok) {
        throw new Error('Failed to fetch total count');
      }
      const data = await response.json();
      console.log('Total count response:', data);
      return data;
    }
  });

  if (!stats) {
    return null;
  }

  const totalEvents = totalCount?.total_counts?.find(count => count.rule_level === "Total")?.event_count || 0;
  const criticalEvents = totalCount?.total_counts?.find(count => count.rule_level === "Critical")?.event_count || 0;
  const highEvents = totalCount?.total_counts?.find(count => count.rule_level === "High")?.event_count || 0;

  const breakdown = [
    { rule_level: 'Critical', event_count: criticalEvents },
    { rule_level: 'High', event_count: highEvents },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Events (24h)"
        value={totalEvents}
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
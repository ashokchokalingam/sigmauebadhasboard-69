import { Activity, AlertTriangle, Database, Monitor, Network, Shield, Users } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Events (24h)"
        value={stats.totalEvents}
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
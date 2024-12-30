import { Database, Shield, Users, AlertTriangle, TrendingUp, TrendingDown, Monitor, Network, Activity, AlertCircle } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  // Add null checks to prevent undefined errors
  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Events (7d)"
        value={stats.totalEvents || 0}
        icon={Database}
        subtitle={`${stats.severity?.critical || 0} Critical, ${stats.severity?.high || 0} High`}
        subtitleIcon={AlertCircle}
      />
      <StatsCard
        title="Risky Users"
        value={stats.uniqueUsers?.current?.toString() || '0'}
        icon={Users}
        subtitle={`${stats.uniqueUsers?.change >= 0 ? '+' : ''}${stats.uniqueUsers?.change || 0}% from last period`}
        subtitleIcon={stats.uniqueUsers?.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Active Computers"
        value={stats.uniqueComputers?.current?.toString() || '0'}
        icon={Monitor}
        subtitle={`${stats.uniqueComputers?.change >= 0 ? '+' : ''}${stats.uniqueComputers?.change || 0}% from last period`}
        subtitleIcon={stats.uniqueComputers?.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Unique IPs"
        value={stats.uniqueIPs?.toString() || '0'}
        icon={Network}
        subtitle="Active in last 7 days"
        subtitleIcon={Activity}
      />
      <StatsCard
        title="Average Risk Score"
        value={(stats.riskScore?.current || 0).toFixed(1)}
        icon={Shield}
        subtitle={`${stats.riskScore?.change >= 0 ? '+' : ''}${stats.riskScore?.change || 0}% from last period`}
        subtitleIcon={stats.riskScore?.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Anomalies (-1)"
        value={stats.anomalies?.current?.toString() || '0'}
        icon={AlertTriangle}
        subtitle={`${stats.anomalies?.change >= 0 ? '+' : ''}${stats.anomalies?.change || 0}% from last period`}
        subtitleIcon={stats.anomalies?.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Medium Events"
        value={stats.severity?.medium?.toString() || '0'}
        icon={AlertCircle}
        subtitle={`${stats.severity?.low || 0} Low Severity Events`}
        subtitleIcon={Activity}
      />
      <StatsCard
        title="High/Critical"
        value={((stats.severity?.high || 0) + (stats.severity?.critical || 0)).toString()}
        icon={AlertTriangle}
        subtitle={`${stats.severity?.critical || 0} Critical, ${stats.severity?.high || 0} High`}
        subtitleIcon={AlertCircle}
      />
    </div>
  );
};

export default StatsSection;
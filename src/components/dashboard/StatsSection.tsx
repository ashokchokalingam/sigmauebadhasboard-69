import { Database, Shield, Users, AlertTriangle, TrendingUp, TrendingDown, Monitor, Network, Activity, AlertCircle } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Events (7d)"
        value={stats.totalEvents}
        icon={Database}
        subtitle={`${stats.severity.critical} Critical, ${stats.severity.high} High`}
        subtitleIcon={AlertCircle}
      />
      <StatsCard
        title="Risky Users"
        value={stats.uniqueUsers.current.toString()}
        icon={Users}
        subtitle={`${stats.uniqueUsers.change >= 0 ? '+' : ''}${stats.uniqueUsers.change}% from last period`}
        subtitleIcon={stats.uniqueUsers.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Active Computers"
        value={stats.uniqueComputers.current.toString()}
        icon={Monitor}
        subtitle={`${stats.uniqueComputers.change >= 0 ? '+' : ''}${stats.uniqueComputers.change}% from last period`}
        subtitleIcon={stats.uniqueComputers.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Unique IPs"
        value={stats.uniqueIPs.toString()}
        icon={Network}
        subtitle={`Active in last 7 days`}
        subtitleIcon={Activity}
      />
      <StatsCard
        title="Average Risk Score"
        value={stats.riskScore.current.toFixed(1)}
        icon={Shield}
        subtitle={`${stats.riskScore.change >= 0 ? '+' : ''}${stats.riskScore.change}% from last period`}
        subtitleIcon={stats.riskScore.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Anomalies (-1)"
        value={stats.anomalies.current.toString()}
        icon={AlertTriangle}
        subtitle={`${stats.anomalies.change >= 0 ? '+' : ''}${stats.anomalies.change}% from last period`}
        subtitleIcon={stats.anomalies.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Medium Events"
        value={stats.severity.medium.toString()}
        icon={AlertCircle}
        subtitle={`${stats.severity.low} Low Severity Events`}
        subtitleIcon={Activity}
      />
      <StatsCard
        title="High/Critical"
        value={(stats.severity.high + stats.severity.critical).toString()}
        icon={AlertTriangle}
        subtitle={`${stats.severity.critical} Critical, ${stats.severity.high} High`}
        subtitleIcon={AlertCircle}
      />
    </div>
  );
};

export default StatsSection;
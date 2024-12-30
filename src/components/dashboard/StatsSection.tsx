import { Database, Shield, Users, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Events"
        value={totalAlerts}
        icon={Database}
        subtitle={`+${Math.round((totalAlerts / (stats.anomalies.current || 1)) * 100)}% from alerts`}
        subtitleIcon={TrendingUp}
      />
      <StatsCard
        title="Risky Users"
        value={stats.uniqueUsers.current.toString()}
        icon={Users}
        subtitle={`${stats.uniqueUsers.change >= 0 ? '+' : ''}${stats.uniqueUsers.change}% from last period`}
        subtitleIcon={stats.uniqueUsers.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Average Risk Score"
        value={stats.riskScore.current.toFixed(1)}
        icon={Shield}
        subtitle={`${stats.riskScore.change >= 0 ? '+' : ''}${stats.riskScore.change}% from last period`}
        subtitleIcon={stats.riskScore.change >= 0 ? TrendingUp : TrendingDown}
      />
      <StatsCard
        title="Anomalies Detected"
        value={stats.anomalies.current.toString()}
        icon={AlertTriangle}
        subtitle={`${stats.anomalies.change >= 0 ? '+' : ''}${stats.anomalies.change}% from last period`}
        subtitleIcon={stats.anomalies.change >= 0 ? TrendingUp : TrendingDown}
      />
    </div>
  );
};

export default StatsSection;
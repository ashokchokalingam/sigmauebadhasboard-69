import { Database, Users, Monitor, AlertTriangle, UserCog } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        title="Total Events (24h)"
        value={totalAlerts.toLocaleString()}
        icon={Database}
        subtitle={`Total events in last 24 hours`}
        subtitleIcon={AlertTriangle}
        breakdown={[
          { rule_level: "Critical", event_count: stats.severity?.critical || 0 },
          { rule_level: "High", event_count: stats.severity?.high || 0 },
        ]}
      />
      <StatsCard
        title="Active Users (24h)"
        value={stats.uniqueUsers?.current?.toString() || "0"}
        icon={Users}
        subtitle={`${stats.uniqueUsers?.users?.length || 0} unique users`}
        subtitleIcon={Users}
      />
      <StatsCard
        title="Active Computers (24h)"
        value={stats.uniqueComputers?.current?.toString() || "0"}
        icon={Monitor}
        subtitle={`${stats.uniqueComputers?.computers?.length || 0} unique systems`}
        subtitleIcon={Monitor}
      />
      <StatsCard
        title="ML Outliers (24h)"
        value={stats.anomalies?.current?.toString() || "0"}
        icon={AlertTriangle}
        subtitle="Total outliers detected"
        subtitleIcon={AlertTriangle}
      />
      <StatsCard
        title="Risky Users (24h)"
        value={(stats.uniqueUsers?.users?.filter(u => u.risk_score > 80)?.length || 0).toString()}
        icon={UserCog}
        subtitle="High risk users detected"
        subtitleIcon={AlertTriangle}
      />
    </div>
  );
};

export default StatsSection;
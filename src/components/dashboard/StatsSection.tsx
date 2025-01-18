import { Database, Users, Monitor, AlertTriangle, UserCog } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  const highRiskUsers = stats?.uniqueUsers?.users?.filter(user => (user?.risk_score ?? 0) > 80)?.length ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6 rounded-xl 
    bg-[#15161E] shadow-2xl border border-[#5856D6]/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5856D6]/10 via-[#5856D6]/5 to-transparent pointer-events-none" />
      <StatsCard
        title="Total Events (24h)"
        value={totalAlerts}
        icon={Database}
        subtitle="Total events in last 24 hours"
        subtitleIcon={AlertTriangle}
        breakdown={[
          { rule_level: "Critical", event_count: stats?.severity?.critical ?? 0 },
          { rule_level: "High", event_count: stats?.severity?.high ?? 0 },
        ]}
      />
      <StatsCard
        title="Active Users (24h)"
        value={stats?.uniqueUsers?.current ?? 0}
        icon={Users}
        subtitle={`${stats?.uniqueUsers?.users?.length ?? 0} unique users`}
        subtitleIcon={Users}
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
import { Users, AlertTriangle, UserCog } from "lucide-react";
import StatsCard from "./StatsCard";
import { Stats } from "./types";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface StatsSectionProps {
  stats: Stats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  const highRiskUsers = stats?.uniqueUsers?.users?.filter(user => (user?.risk_score ?? 0) > 80)?.length ?? 0;

  // Prepare data for the donut chart
  const severityData = [
    { name: 'Critical', value: stats?.severity?.critical ?? 0, color: '#EF4444' },  // red-500
    { name: 'High', value: stats?.severity?.high ?? 0, color: '#F97316' },         // orange-500
    { name: 'Medium', value: stats?.severity?.medium ?? 0, color: '#3B82F6' },     // blue-500
    { name: 'Low', value: stats?.severity?.low ?? 0, color: '#6B7280' }            // gray-500
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-xl 
    bg-[#15161E] shadow-2xl border border-[#5856D6]/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5856D6]/10 via-[#5856D6]/5 to-transparent pointer-events-none" />
      
      {/* Severity Distribution Chart */}
      <div className="bg-[#15161E]/60 border border-[#5856D6]/20 hover:border-[#5856D6]/40 
        transition-all duration-300 group backdrop-blur-sm relative overflow-hidden
        shadow-lg shadow-[#5856D6]/5 hover:shadow-[#5856D6]/10 rounded-xl p-4">
        <h3 className="text-white/90 font-medium mb-4">Severity Distribution</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ color: '#F3F4F6' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ML Outliers Card */}
      <StatsCard
        title="ML Outliers (24h)"
        value={stats?.anomalies?.current ?? 0}
        icon={AlertTriangle}
        subtitle="Total outliers detected"
        subtitleIcon={AlertTriangle}
      />

      {/* Risky Users Card */}
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
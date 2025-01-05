import { Alert } from "../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

interface TimelineChartProps {
  alerts: Alert[];
  timeRange: '1h' | '24h' | '7d';
  selectedSeverity: string | null;
}

const TimelineChart = ({ alerts, timeRange, selectedSeverity }: TimelineChartProps) => {
  const data = useMemo(() => {
    const timeGroups: { [key: string]: any } = {};
    
    alerts.forEach(alert => {
      const date = new Date(alert.system_time);
      const hour = date.getHours();
      const timeKey = `${date.toLocaleDateString()} ${hour}:00`;
      
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = {
          time: timeKey,
          critical: 0,
          high: 0,
          medium: 0,
          total: 0
        };
      }
      
      const severity = alert.rule_level?.toLowerCase() || 'medium';
      timeGroups[timeKey][severity]++;
      timeGroups[timeKey].total++;
    });

    return Object.values(timeGroups).sort((a: any, b: any) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }, [alerts]);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-blue-300/70">
        No timeline data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            stroke="#475569"
            tick={{ fill: '#64748B', fontSize: 11 }}
            tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Bar
            dataKey={selectedSeverity?.toLowerCase() || "total"}
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
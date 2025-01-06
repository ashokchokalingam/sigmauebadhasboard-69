import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert } from './types';
import { format, parseISO } from 'date-fns';

interface TimelineEventBarChartProps {
  logs: Alert[];
}

const TimelineEventBarChart = ({ logs }: TimelineEventBarChartProps) => {
  // Process logs to create time-based data points
  const processData = () => {
    const timeMap = new Map<string, number>();
    
    logs.forEach(log => {
      const date = format(parseISO(log.system_time), 'MM/dd HH:mm');
      timeMap.set(date, (timeMap.get(date) || 0) + 1);
    });

    return Array.from(timeMap.entries()).map(([time, count]) => ({
      time,
      count
    })).sort((a, b) => a.time.localeCompare(b.time));
  };

  const data = processData();

  if (data.length === 0) return null;

  return (
    <div className="w-full h-[120px] mt-4 bg-black/20 rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis
            dataKey="time"
            tick={{ fill: '#64748B', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={25}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '6px',
              color: '#fff'
            }}
          />
          <Bar
            dataKey="count"
            fill="#3B82F6"
            radius={[2, 2, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineEventBarChart;
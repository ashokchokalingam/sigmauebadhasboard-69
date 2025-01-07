import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimelineDataPoint } from './timelineUtils';

interface TimelineChartProps {
  data: TimelineDataPoint[];
  viewMode: 'count' | 'severity';
  onRangeSelect?: (range: [Date, Date] | null) => void;
}

const TimelineChart = ({
  data,
  viewMode,
}: TimelineChartProps) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[200px] text-blue-300/70">
        No data available
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          barSize={4}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255,255,255,0.05)" 
          />
          
          <XAxis
            dataKey="timestamp"
            stroke="#475569"
            tick={{ fill: '#64748B', fontSize: 11 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleTimeString([], { 
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });
            }}
          />
          
          <YAxis
            stroke="#475569"
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const date = new Date(payload[0].payload.timestamp);
                return (
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
                    <p className="text-slate-300 text-sm">
                      {date.toLocaleString()}
                    </p>
                    <p className="text-blue-400 font-mono text-sm">
                      {payload[0].value} events
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Bar
            dataKey="count"
            fill="#3B82F6"
            radius={[2, 2, 0, 0]}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
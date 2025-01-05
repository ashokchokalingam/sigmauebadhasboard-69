import { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimelineDataPoint } from './timelineUtils';
import TimelineTooltip from './TimelineTooltip';

interface TimelineChartProps {
  data: TimelineDataPoint[];
  viewMode: 'count' | 'severity';
  zoomLevel: number;
  onRangeSelect: (range: [Date, Date] | null) => void;
}

const TimelineChart = ({
  data,
  viewMode,
  zoomLevel,
  onRangeSelect,
}: TimelineChartProps) => {
  const chartRef = useRef<any>(null);

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
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          barSize={Math.max(4, 20 - (zoomLevel * 2))}
          ref={chartRef}
        >
          <defs>
            <linearGradient id="severityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          
          <XAxis
            dataKey="timestamp"
            stroke="#475569"
            tick={{ fill: '#64748B', fontSize: 11 }}
            tickFormatter={(value) => new Date(value).toLocaleTimeString([], { 
              hour: '2-digit',
              minute: '2-digit'
            })}
          />
          
          <YAxis
            stroke="#475569"
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          
          <Tooltip content={<TimelineTooltip />} />

          {viewMode === 'count' ? (
            <Bar
              dataKey="count"
              fill="url(#severityGradient)"
              radius={[4, 4, 0, 0]}
            />
          ) : (
            <>
              <Bar
                dataKey="critical"
                stackId="severity"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="high"
                stackId="severity"
                fill="#F59E0B"
              />
              <Bar
                dataKey="medium"
                stackId="severity"
                fill="#10B981"
              />
              <Bar
                dataKey="low"
                stackId="severity"
                fill="#3B82F6"
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
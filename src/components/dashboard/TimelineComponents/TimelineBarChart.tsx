import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Legend } from 'recharts';
import { getSeverityColor } from '../utils/timelineDataUtils';
import TimelineTooltip from '../TimelineTooltip';

interface TimelineDataPoint {
  fullDate: string;
  counts: {
    [key: string]: number;
  };
  events: any[];
  categories: { [key: string]: number };
  anomalies: number;
  cumulativeTotal: number;
}

interface TimelineBarChartProps {
  data: TimelineDataPoint[];
  onBrushChange?: (domain: any) => void;
  selectedSeverity?: string | null;
  zoomDomain?: { start: number; end: number } | null;
}

const TimelineBarChart = ({ 
  data, 
  onBrushChange,
  selectedSeverity,
  zoomDomain 
}: TimelineBarChartProps) => {
  return (
    <div className="w-full h-[400px] bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/10">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="rgba(255,255,255,0.05)"
          />
          <XAxis
            dataKey="fullDate"
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#94A3B8', 
              fontSize: 10,
              dy: 10
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#94A3B8', 
              fontSize: 10,
              dx: -10
            }}
            width={40}
          />
          <Tooltip 
            content={<TimelineTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            content={({ payload }) => (
              <div className="flex justify-end gap-4 mb-4 text-xs text-gray-400">
                {payload?.map((entry: any) => (
                  <div key={entry.value} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.value}
                  </div>
                ))}
              </div>
            )}
          />
          <Bar
            dataKey="cumulativeTotal"
            fill="url(#barGradient)"
            radius={[2, 2, 0, 0]}
            maxBarSize={40}
            isAnimationActive={true}
            animationDuration={300}
            animationBegin={0}
          />
          <Brush
            dataKey="fullDate"
            height={30}
            stroke="#4B5563"
            fill="rgba(17, 24, 39, 0.7)"
            tickFormatter={(value) => ''}
            startIndex={Math.max(0, data.length - 50)}
          >
            <rect x={0} y={0} width="100%" height="100%" fill="rgba(17, 24, 39, 0.7)" />
          </Brush>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineBarChart;
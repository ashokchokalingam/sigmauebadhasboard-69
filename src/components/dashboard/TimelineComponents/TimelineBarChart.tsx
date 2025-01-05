import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  // Add console.log to debug data
  console.log('Timeline data:', data);

  return (
    <div className="w-full h-[300px] bg-black/40 rounded-lg border border-blue-500/10">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          barSize={20}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.3}/>
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
              fill: '#64748B', 
              fontSize: 11,
              dy: 10
            }}
            interval="preserveStartEnd"
          />
          
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#64748B', 
              fontSize: 11,
              dx: -10
            }}
            width={40}
          />
          
          <Tooltip 
            content={<TimelineTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          
          {/* Add bars for each severity level */}
          {selectedSeverity ? (
            <Bar
              dataKey={`counts.${selectedSeverity}`}
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationDuration={300}
              animationBegin={0}
            />
          ) : (
            <>
              <Bar
                dataKey="cumulativeTotal"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                animationDuration={300}
                animationBegin={0}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineBarChart;
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
  return (
    <div className="w-full h-[300px] bg-black/40 rounded-lg border border-blue-500/10">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          barSize={4}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity={1}/>
              <stop offset="100%" stopColor="#34D399" stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="rgba(255,255,255,0.03)"
          />
          
          <XAxis
            dataKey="fullDate"
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#64748B', 
              fontSize: 10,
              dy: 10
            }}
            interval="preserveStartEnd"
          />
          
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#64748B', 
              fontSize: 10,
              dx: -10
            }}
            width={30}
          />
          
          <Tooltip 
            content={<TimelineTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
          />
          
          <Bar
            dataKey="cumulativeTotal"
            fill="url(#barGradient)"
            radius={[2, 2, 0, 0]}
            isAnimationActive={true}
            animationDuration={300}
            animationBegin={0}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineBarChart;
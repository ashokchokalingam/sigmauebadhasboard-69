import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Area } from 'recharts';
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
    <div className="w-full h-[400px] bg-[#0D1117] rounded-lg p-4 border border-blue-500/5">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.3}/>
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
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
          />

          <Area
            type="monotone"
            dataKey="cumulativeTotal"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#areaGradient)"
            animationDuration={1000}
          />
          
          <Bar
            dataKey="cumulativeTotal"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            isAnimationActive={true}
            animationDuration={1000}
            animationBegin={0}
          />
          
          <Brush
            dataKey="fullDate"
            height={40}
            stroke="#3B82F6"
            fill="#0D1117"
            travellerWidth={8}
            className="mt-4"
          >
            <rect x={0} y={0} width="100%" height="100%" fill="#0D1117" />
          </Brush>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineBarChart;
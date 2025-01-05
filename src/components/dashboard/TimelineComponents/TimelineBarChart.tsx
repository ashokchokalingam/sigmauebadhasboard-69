import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Legend, Line, ComposedChart } from 'recharts';
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
    <div className="w-full h-[400px] bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-lg p-4 border border-blue-500/10">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            {['high', 'medium', 'low', 'informational'].map((severity) => (
              <linearGradient key={severity} id={`gradient-${severity}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getSeverityColor(severity)} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={getSeverityColor(severity)} stopOpacity={0.3}/>
              </linearGradient>
            ))}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity={1}/>
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#60A5FA" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="opacity-10"
            vertical={false}
          />
          <XAxis
            dataKey="fullDate"
            scale="band"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={{ stroke: '#1e293b' }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={{ stroke: '#1e293b' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={{ stroke: '#1e293b' }}
          />
          <Tooltip content={<TimelineTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              paddingTop: '10px',
              borderTop: '1px solid rgba(148, 163, 184, 0.1)'
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="counts.high"
            stackId="a"
            fill="url(#gradient-high)"
            name="High"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="counts.medium"
            stackId="a"
            fill="url(#gradient-medium)"
            name="Medium"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="counts.low"
            stackId="a"
            fill="url(#gradient-low)"
            name="Low"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="counts.informational"
            stackId="a"
            fill="url(#gradient-informational)"
            name="Info"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativeTotal"
            stroke="url(#lineGradient)"
            strokeWidth={2}
            dot={{ 
              fill: '#8B5CF6',
              strokeWidth: 2,
              r: 4,
              stroke: '#1e293b'
            }}
            name="Cumulative Events"
          />
          <Brush
            dataKey="fullDate"
            height={30}
            stroke="#4B5563"
            fill="#1F2937"
            travellerWidth={10}
            className="opacity-50"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineBarChart;
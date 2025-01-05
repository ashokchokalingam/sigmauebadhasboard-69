import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Legend, Line, ComposedChart } from 'recharts';
import { Alert } from '../types';
import { getSeverityColor } from '../utils/timelineDataUtils';
import TimelineTooltip from '../TimelineTooltip';
import { useTheme } from 'next-themes';

interface TimelineBarChartProps {
  data: any[];
  onBrushChange: (domain: any) => void;
  selectedSeverity: string | null;
  zoomDomain: { start: number; end: number } | null;
}

const TimelineBarChart = ({ 
  data, 
  onBrushChange, 
  selectedSeverity,
  zoomDomain 
}: TimelineBarChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calculate max value for better y-axis scaling
  const maxValue = Math.max(...data.map(item => 
    Object.values(item.counts).reduce((sum: number, count: number) => sum + count, 0)
  ));

  // Custom Y-axis tick formatter to avoid decimals
  const formatYAxis = (value: number) => Math.floor(value).toString();

  return (
    <div className="w-full h-[500px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          className="bg-black/40 backdrop-blur-sm rounded-lg"
        >
          <defs>
            {['high', 'medium', 'low', 'informational'].map((severity) => (
              <linearGradient key={severity} id={`gradient-${severity}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getSeverityColor(severity)} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={getSeverityColor(severity)} stopOpacity={0.3}/>
              </linearGradient>
            ))}
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? "rgba(147, 197, 253, 0.1)" : "rgba(0, 0, 0, 0.1)"}
            vertical={false}
          />
          
          <XAxis 
            dataKey="fullDate"
            stroke="#93c5fd"
            tick={{ 
              fill: isDark ? '#93c5fd' : '#1e293b',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
            height={60}
            angle={-45}
            textAnchor="end"
            interval="preserveStartEnd"
            minTickGap={30}
            axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
            tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
            dy={20}
          />
          
          <YAxis 
            yAxisId="left"
            stroke="#93c5fd"
            tick={{ 
              fill: isDark ? '#93c5fd' : '#1e293b',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
            tickFormatter={formatYAxis}
            width={45}
            axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
            tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
          />
          
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#93c5fd"
            tick={{ 
              fill: isDark ? '#93c5fd' : '#1e293b',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
            tickFormatter={formatYAxis}
            width={45}
            axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
            tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
          />
          
          <Tooltip 
            content={<TimelineTooltip />}
            cursor={{
              fill: isDark ? 'rgba(147, 197, 253, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }}
          />
          
          <Legend 
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              paddingBottom: '20px'
            }}
          />
          
          {['high', 'medium', 'low', 'informational'].map((severity) => (
            <Bar
              key={severity}
              dataKey={`counts.${severity}`}
              name={`${severity.charAt(0).toUpperCase() + severity.slice(1)} Events`}
              stackId="a"
              fill={`url(#gradient-${severity})`}
              opacity={selectedSeverity ? (selectedSeverity === severity ? 1 : 0.3) : 0.8}
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
          ))}

          <Line
            type="monotone"
            dataKey="cumulativeTotal"
            name="Cumulative Events"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={false}
            yAxisId="right"
            activeDot={{ r: 6, stroke: '#60A5FA', strokeWidth: 2, fill: '#fff' }}
          />

          <Brush
            dataKey="fullDate"
            height={40}
            stroke="#3b82f6"
            fill={isDark ? '#1a1f2c' : '#f8fafc'}
            onChange={onBrushChange}
            startIndex={zoomDomain?.start}
            endIndex={zoomDomain?.end}
            travellerWidth={10}
            gap={1}
            y={320}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineBarChart;
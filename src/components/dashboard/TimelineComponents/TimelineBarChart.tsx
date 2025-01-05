import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Legend, Line, ComposedChart } from 'recharts';
import { Alert } from '../types';
import { getSeverityColor } from '../utils/timelineDataUtils';
import TimelineTooltip from '../TimelineTooltip';

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
  // Calculate cumulative counts for trend line
  const dataWithCumulative = data.map((item, index) => {
    const previousTotal = index > 0 ? data[index - 1].cumulativeTotal || 0 : 0;
    const currentTotal = Object.values(item.counts).reduce((sum: number, count: number) => sum + count, 0);
    return {
      ...item,
      cumulativeTotal: previousTotal + currentTotal
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={dataWithCumulative}
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        barSize={20}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="rgba(147, 197, 253, 0.1)"
          vertical={false}
        />
        
        <XAxis 
          dataKey="fullDate"
          stroke="#93c5fd"
          tick={{ 
            fill: '#93c5fd',
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
          stroke="#93c5fd"
          tick={{ 
            fill: '#93c5fd',
            fontSize: 12,
            fontFamily: 'monospace'
          }}
          width={45}
          axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
          tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
          yAxisId="left"
        />
        
        <YAxis 
          orientation="right"
          stroke="#93c5fd"
          tick={{ 
            fill: '#93c5fd',
            fontSize: 12,
            fontFamily: 'monospace'
          }}
          width={45}
          axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
          tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
          yAxisId="right"
        />
        
        <Tooltip content={<TimelineTooltip />} />
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
            name={`${severity} Events`}
            stackId="a"
            fill={getSeverityColor(severity)}
            opacity={selectedSeverity ? (selectedSeverity === severity ? 1 : 0.3) : 0.8}
            yAxisId="left"
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
        />

        <Brush
          dataKey="fullDate"
          height={40}
          stroke="#3b82f6"
          fill="#1a1f2c"
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
  );
};

export default TimelineBarChart;
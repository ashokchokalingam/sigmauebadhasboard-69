import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Legend, Line, ComposedChart } from 'recharts';
import { Alert } from '../types';
import { getSeverityColor } from '../utils/timelineDataUtils';
import TimelineTooltip from '../TimelineTooltip';
import { useMemo } from 'react';
import { processTimelineData } from '../utils/timelineDataUtils';

interface TimelineBarChartProps {
  data: Alert[];
  granularity?: '5min' | 'hour' | 'day';
}

const TimelineBarChart = ({ data, granularity = 'hour' }: TimelineBarChartProps) => {
  const processedData = useMemo(() => processTimelineData(data, granularity), [data, granularity]);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="fullDate"
            scale="band"
            className="text-xs"
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: '#94a3b8' }}
            className="text-xs"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#94a3b8' }}
            className="text-xs"
          />
          <Tooltip content={<TimelineTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="counts.high"
            stackId="a"
            fill={getSeverityColor('high')}
            name="High"
          />
          <Bar
            yAxisId="left"
            dataKey="counts.medium"
            stackId="a"
            fill={getSeverityColor('medium')}
            name="Medium"
          />
          <Bar
            yAxisId="left"
            dataKey="counts.low"
            stackId="a"
            fill={getSeverityColor('low')}
            name="Low"
          />
          <Bar
            yAxisId="left"
            dataKey="counts.informational"
            stackId="a"
            fill={getSeverityColor('informational')}
            name="Info"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativeTotal"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={{ fill: '#60A5FA', r: 4 }}
            name="Cumulative Events"
          />
          <Brush
            dataKey="fullDate"
            height={30}
            stroke="#4B5563"
            fill="#1F2937"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineBarChart;
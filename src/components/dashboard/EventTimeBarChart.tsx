import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Alert } from './types';

interface EventTimeBarChartProps {
  event: Alert;
}

const EventTimeBarChart: React.FC<EventTimeBarChartProps> = ({ event }) => {
  const data = [
    {
      name: 'Event Times',
      'First Seen': new Date(event.first_time_seen || event.system_time).getTime(),
      'Last Seen': new Date(event.last_time_seen || event.system_time).getTime(),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-sidebar p-2 rounded-lg border border-sidebar-border">
          <p className="text-sm text-sidebar-foreground">
            {payload[0].name}: {format(payload[0].value, 'MMM d, yyyy HH:mm:ss')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[100px] w-full bg-sidebar/50 rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barGap={0}
        >
          <XAxis dataKey="name" stroke="#64748B" />
          <YAxis
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => format(value, 'HH:mm')}
            stroke="#64748B"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="First Seen"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Last Seen"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventTimeBarChart;
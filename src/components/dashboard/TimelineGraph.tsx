import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert } from './types';

interface TimelineGraphProps {
  alerts: Alert[];
}

const TimelineGraph = ({ alerts }: TimelineGraphProps) => {
  // Process alerts to create data points based on timeframe
  const processData = () => {
    const timeData: { [key: string]: { time: string; fullDate: string; count: number } } = {};
    
    alerts.forEach(alert => {
      const date = new Date(alert.system_time);
      const hour = date.getHours().toString().padStart(2, '0');
      const formattedDate = date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const key = `${date.toISOString().split('T')[0]} ${hour}:00`;
      
      if (!timeData[key]) {
        timeData[key] = {
          time: `${hour}:00`,
          fullDate: formattedDate,
          count: 1
        };
      } else {
        timeData[key].count++;
      }
    });

    // Convert to array and sort by time
    return Object.values(timeData).sort((a, b) => 
      a.time.localeCompare(b.time)
    );
  };

  const data = processData();

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
          <XAxis 
            dataKey="fullDate" 
            stroke="#4b5563"
            tick={{ fill: '#4b5563' }}
            height={40}
            angle={-45}
            textAnchor="end"
          />
          <YAxis 
            stroke="#4b5563"
            tick={{ fill: '#4b5563' }}
            width={25}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a2234',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#93c5fd' }}
            itemStyle={{ color: '#93c5fd' }}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            name="Events"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6, fill: '#60a5fa' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineGraph;
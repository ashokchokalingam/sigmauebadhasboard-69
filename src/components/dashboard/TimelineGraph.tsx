import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert } from './types';

interface TimelineGraphProps {
  alerts: Alert[];
}

const TimelineGraph = ({ alerts }: TimelineGraphProps) => {
  // Process alerts to create hourly data points
  const processData = () => {
    const hourlyData: { [key: string]: { time: string; count: number } } = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      hourlyData[hour] = {
        time: `${hour}:00`,
        count: 0
      };
    }

    // Count alerts per hour
    alerts.forEach(alert => {
      const date = new Date(alert.system_time);
      const hour = date.getHours().toString().padStart(2, '0');
      if (hourlyData[hour]) {
        hourlyData[hour].count++;
      }
    });

    // Convert to array and sort by time
    return Object.values(hourlyData).sort((a, b) => 
      a.time.localeCompare(b.time)
    );
  };

  const data = processData();

  return (
    <div className="w-full h-[200px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
          <XAxis 
            dataKey="time" 
            stroke="#4b5563"
            tick={{ fill: '#4b5563' }}
          />
          <YAxis 
            stroke="#4b5563"
            tick={{ fill: '#4b5563' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a2234',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#93c5fd' }}
            itemStyle={{ color: '#93c5fd' }}
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
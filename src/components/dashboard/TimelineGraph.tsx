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
      const minute = date.getMinutes().toString().padStart(2, '0');
      
      // Format the date for display
      const formattedDate = date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const key = `${date.toISOString().split('T')[0]} ${hour}:${minute}`;
      
      if (!timeData[key]) {
        timeData[key] = {
          time: `${hour}:${minute}`,
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
    <div className="w-full h-[300px]"> {/* Increased height for better visibility */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 60  // Increased bottom margin for date labels
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
          <XAxis 
            dataKey="fullDate" 
            stroke="#93c5fd"
            tick={{ 
              fill: '#93c5fd',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
            height={50}  // Increased height for better label visibility
            angle={-45}
            textAnchor="end"
            interval={Math.floor(data.length / 8)}  // Show fewer labels to prevent overlap
          />
          <YAxis 
            stroke="#93c5fd"
            tick={{ 
              fill: '#93c5fd',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a2234',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              padding: '8px'
            }}
            labelStyle={{ 
              color: '#93c5fd',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
            itemStyle={{ 
              color: '#93c5fd',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            name="Events"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ 
              fill: '#3b82f6', 
              r: 4,
              strokeWidth: 2
            }}
            activeDot={{ 
              r: 6, 
              fill: '#60a5fa',
              stroke: '#93c5fd',
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineGraph;
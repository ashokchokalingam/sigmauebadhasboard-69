import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelineGraphProps {
  alerts: any[];
}

const TimelineGraph = ({ alerts }: TimelineGraphProps) => {
  const processData = () => {
    const timeData: { [key: string]: { time: string; fullDate: string; count: number } } = {};
    
    alerts.forEach(alert => {
      const date = new Date(alert.system_time);
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      
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

    return Object.values(timeData).sort((a, b) => 
      a.time.localeCompare(b.time)
    );
  };

  const data = processData();

  return (
    <div className="w-full h-[300px] relative group">
      <div className="absolute inset-0 bg-[#1a1f2c]/90 rounded-xl" />
      
      <div className="relative w-full h-full p-4 backdrop-blur-sm rounded-xl border border-[#3b82f6]/20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(59, 130, 246, 0.1)"
              vertical={false}
            />
            
            <XAxis 
              dataKey="fullDate"
              stroke="#3b82f6"
              tick={{ 
                fill: '#3b82f6',
                fontSize: 12,
                fontFamily: 'monospace'
              }}
              height={50}
              angle={-45}
              textAnchor="end"
              interval={Math.floor(data.length / 8)}
              axisLine={{ stroke: '#3b82f6', strokeWidth: 1, opacity: 0.3 }}
              tickLine={{ stroke: '#3b82f6', strokeWidth: 1, opacity: 0.3 }}
            />
            
            <YAxis 
              stroke="#3b82f6"
              tick={{ 
                fill: '#3b82f6',
                fontSize: 12,
                fontFamily: 'monospace'
              }}
              width={40}
              axisLine={{ stroke: '#3b82f6', strokeWidth: 1, opacity: 0.3 }}
              tickLine={{ stroke: '#3b82f6', strokeWidth: 1, opacity: 0.3 }}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 34, 52, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(4px)',
                color: '#3b82f6',
                fontFamily: 'monospace'
              }}
              labelStyle={{ 
                color: '#3b82f6',
                fontFamily: 'monospace',
                fontSize: '13px',
                marginBottom: '8px'
              }}
            />
            
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ 
                fill: '#3b82f6', 
                r: 4,
                strokeWidth: 2,
                strokeOpacity: 0.8
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
    </div>
  );
};

export default TimelineGraph;
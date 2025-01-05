import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Alert } from './types';

interface TimelineGraphProps {
  alerts: Alert[];
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
    <div className="w-full h-[400px] relative group">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl" />
      
      {/* Main chart container */}
      <div className="relative w-full h-full p-4 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:border-blue-500/30">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
          >
            {/* Stylish grid */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(147, 197, 253, 0.1)"
              vertical={false}
            />
            
            {/* X-axis with enhanced styling */}
            <XAxis 
              dataKey="fullDate"
              stroke="#93c5fd"
              tick={{ 
                fill: '#93c5fd',
                fontSize: 12,
                fontFamily: 'monospace'
              }}
              height={50}
              angle={-45}
              textAnchor="end"
              interval={Math.floor(data.length / 8)}
              axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
              tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
            />
            
            {/* Y-axis with enhanced styling */}
            <YAxis 
              stroke="#93c5fd"
              tick={{ 
                fill: '#93c5fd',
                fontSize: 12,
                fontFamily: 'monospace'
              }}
              width={40}
              axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
              tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
            />
            
            {/* Enhanced tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 34, 52, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(4px)'
              }}
              labelStyle={{ 
                color: '#93c5fd',
                fontFamily: 'monospace',
                fontSize: '13px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}
              itemStyle={{ 
                color: '#93c5fd',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
              labelFormatter={(label) => `Time: ${label}`}
            />
            
            {/* Styled legend */}
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontFamily: 'monospace'
              }}
            />
            
            {/* Gradient area */}
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Area with gradient */}
            <Area
              type="monotone"
              dataKey="count"
              name="Events"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorCount)"
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
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Animated glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse rounded-xl" />
      </div>
    </div>
  );
};

export default TimelineGraph;
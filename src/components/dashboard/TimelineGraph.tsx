import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Alert } from './types';

interface TimelineGraphProps {
  alerts: Alert[];
}

const TimelineGraph = ({ alerts }: TimelineGraphProps) => {
  const processData = () => {
    const timeData: { [key: string]: { time: string; fullDate: string; count: number; severity: string } } = {};
    
    alerts.forEach(alert => {
      // Ensure we have a valid date string
      const dateStr = alert.system_time || alert.first_time_seen;
      if (!dateStr) return;

      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return; // Skip invalid dates
        
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
            count: 1,
            severity: alert.rule_level || 'unknown'
          };
        } else {
          timeData[key].count++;
        }
      } catch (error) {
        console.warn('Invalid date encountered:', dateStr);
        return;
      }
    });

    return Object.values(timeData).sort((a, b) => 
      a.time.localeCompare(b.time)
    );
  };

  const getSeverityColor = (severity: string = '') => {
    const s = severity.toLowerCase();
    if (s.includes('critical')) return '#FF4500';
    if (s.includes('high')) return '#FF8C00';
    if (s.includes('medium')) return '#FFD700';
    if (s.includes('low')) return '#32CD32';
    if (s.includes('informational')) return '#1E90FF';
    return '#3b82f6';
  };

  const data = processData();

  return (
    <div className="w-full h-[400px] relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl" />
      
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
              height={50}
              angle={-45}
              textAnchor="end"
              interval={Math.floor(data.length / 8)}
              axisLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
              tickLine={{ stroke: '#93c5fd', strokeWidth: 1, opacity: 0.3 }}
            />
            
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
            
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontFamily: 'monospace'
              }}
            />
            
            {data.map((item, index) => (
              <defs key={index}>
                <linearGradient id={`colorCount${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getSeverityColor(item.severity)} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getSeverityColor(item.severity)} stopOpacity={0}/>
                </linearGradient>
              </defs>
            ))}
            
            <Area
              type="monotone"
              dataKey="count"
              name="Events"
              stroke={getSeverityColor(data[0]?.severity)}
              strokeWidth={2}
              fill={`url(#colorCount0)`}
              dot={{ 
                fill: getSeverityColor(data[0]?.severity), 
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
      
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse rounded-xl" />
      </div>
    </div>
  );
};

export default TimelineGraph;
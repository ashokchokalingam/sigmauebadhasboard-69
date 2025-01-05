import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Alert } from './types';

interface TimelineGraphProps {
  alerts: Alert[];
}

const TimelineGraph = ({ alerts }: TimelineGraphProps) => {
  const processData = () => {
    const timeData: { [key: string]: { time: string; fullDate: string; count: number; severity: string; events: Alert[] } } = {};
    
    alerts.forEach(alert => {
      const dateStr = alert.system_time || alert.first_time_seen;
      if (!dateStr) return;

      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;
        
        // Group by 15-minute intervals for better data density
        const minutes = Math.floor(date.getMinutes() / 15) * 15;
        const hour = date.getHours();
        
        const formattedDate = date.toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        const key = `${date.toISOString().split('T')[0]} ${hour}:${minutes}`;
        
        if (!timeData[key]) {
          timeData[key] = {
            time: `${hour}:${minutes}`,
            fullDate: formattedDate,
            count: 1,
            severity: alert.rule_level || 'unknown',
            events: [alert]
          };
        } else {
          timeData[key].count++;
          timeData[key].events.push(alert);
          // Update severity to the highest level
          if (alert.rule_level === 'critical' || alert.rule_level === 'high') {
            timeData[key].severity = alert.rule_level;
          }
        }
      } catch (error) {
        console.warn('Invalid date encountered:', dateStr);
        return;
      }
    });

    return Object.values(timeData).sort((a, b) => 
      new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
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

  const data = useMemo(() => processData(), [alerts]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const { fullDate, count, events } = payload[0].payload;

    return (
      <div className="bg-black/90 p-4 rounded-lg border border-blue-500/20 shadow-xl backdrop-blur-sm">
        <p className="text-blue-300 font-mono text-sm mb-2">{fullDate}</p>
        <p className="text-white font-medium mb-2">Total Events: {count}</p>
        <div className="max-h-32 overflow-y-auto">
          {events.slice(0, 3).map((event: Alert, index: number) => (
            <div key={index} className="text-sm text-blue-200/80 mb-1 border-l-2 pl-2" style={{ borderColor: getSeverityColor(event.rule_level) }}>
              {event.title}
            </div>
          ))}
          {events.length > 3 && (
            <p className="text-xs text-blue-300/60 mt-1">
              +{events.length - 3} more events...
            </p>
          )}
        </div>
      </div>
    );
  };

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
              left: 50,
              bottom: 60
            }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
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
              label={{
                value: "Timeline",
                position: "bottom",
                offset: 40,
                style: { fill: '#93c5fd' }
              }}
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
              label={{
                value: "Event Count",
                angle: -90,
                position: "insideLeft",
                style: { fill: '#93c5fd' }
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontFamily: 'monospace'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="count"
              name="Events"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorCount)"
              dot={(props: any) => {
                const severity = props.payload.severity;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={getSeverityColor(severity)}
                    stroke="#1a1f2c"
                    strokeWidth={2}
                    style={{ opacity: 0.8 }}
                  />
                );
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
    </div>
  );
};

export default TimelineGraph;
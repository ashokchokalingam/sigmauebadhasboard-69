import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert } from './types';
import { processTimelineData, getSeverityColor } from './utils/timelineDataUtils';
import TimelineTooltip from './TimelineTooltip';

interface TimelineGraphProps {
  alerts: Alert[];
}

const TimelineGraph = ({ alerts }: TimelineGraphProps) => {
  const data = useMemo(() => processTimelineData(alerts), [alerts]);

  return (
    <div className="w-full h-[400px] relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl" />
      
      <div className="relative w-full h-full p-4 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:border-blue-500/30">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
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
            
            <Tooltip content={<TimelineTooltip />} />
            
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
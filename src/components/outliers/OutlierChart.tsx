import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { ChartDataPoint } from "./types";
import { OutlierTooltip } from "./OutlierTooltip";

interface OutlierChartProps {
  data: ChartDataPoint[];
}

export const OutlierChart = ({ data }: OutlierChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-purple-400">
        No data available
      </div>
    );
  }

  return (
    <div className="h-[300px] -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="rgba(255,255,255,0.05)"
          />

          <XAxis 
            dataKey="timestamp" 
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            tick={{ fill: '#E2E8F0' }}
            tickFormatter={(timestamp) => {
              if (!timestamp) return '';
              try {
                const date = new Date(timestamp);
                return format(date, 'HH:mm');
              } catch (e) {
                console.error('Error formatting date:', e);
                return '';
              }
            }}
          />
          
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            tick={{ fill: '#94A3B8' }}
          />
          
          <Tooltip content={<OutlierTooltip />} />

          <Area
            type="monotone"
            dataKey="high"
            name="High Severity"
            stackId="1"
            stroke="#EF4444"
            fill="url(#colorHigh)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="medium"
            name="Medium Severity"
            stackId="1"
            stroke="#F59E0B"
            fill="url(#colorMedium)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="low"
            name="Low Severity"
            stackId="1"
            stroke="#10B981"
            fill="url(#colorLow)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
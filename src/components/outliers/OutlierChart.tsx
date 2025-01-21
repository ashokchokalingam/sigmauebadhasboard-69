import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { ChartDataPoint } from "./types";
import { OutlierTooltip } from "./OutlierTooltip";

interface OutlierChartProps {
  data: ChartDataPoint[];
}

export const OutlierChart = ({ data }: OutlierChartProps) => {
  return (
    <div className="h-[300px] -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9333EA" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={1}/>
              <stop offset="95%" stopColor="#9333EA" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(147, 51, 234, 0.1)" 
            vertical={false}
          />
          <XAxis 
            dataKey="timestamp"
            stroke="#D8B4FE"
            tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
            tick={{ fill: '#D8B4FE', fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left" 
            stroke="#D8B4FE"
            tick={{ fill: '#D8B4FE', fontSize: 12 }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#D8B4FE"
            tick={{ fill: '#D8B4FE', fontSize: 12 }}
            domain={[0, 'dataMax + 20']}
          />
          <Tooltip content={<OutlierTooltip />} />
          
          <Area
            type="monotone"
            dataKey="count"
            stroke="url(#lineGradient)"
            fill="url(#areaGradient)"
            strokeWidth={2}
            yAxisId="left"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="risk" 
            stroke="#38BDF8"
            strokeWidth={2}
            yAxisId="right"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
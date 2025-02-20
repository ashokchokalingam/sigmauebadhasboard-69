
import { Bar, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
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
            <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#D32F2F" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5722" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FF5722" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFB74D" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FFB74D" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#66BB6A" stopOpacity={0.2}/>
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
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#D8B4FE"
            tick={{ fill: '#D8B4FE', fontSize: 12 }}
          />
          <Tooltip content={<OutlierTooltip />} />
          <Bar 
            dataKey="count"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          >
            {data.map((entry, index) => {
              let fillUrl = '#lowGradient';
              if (entry.risk >= 150) fillUrl = '#criticalGradient';
              else if (entry.risk >= 100) fillUrl = '#highGradient';
              else if (entry.risk >= 50) fillUrl = '#mediumGradient';
              
              return (
                <Cell 
                  key={`cell-${index}`}
                  fill={`url(${fillUrl})`}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              );
            })}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

import { Bar, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { format } from "date-fns";
import { ChartDataPoint } from "./types";
import { OutlierTooltip } from "./OutlierTooltip";

interface OutlierChartProps {
  data: ChartDataPoint[];
}

const getTimeOfDay = (hour: number): string => {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#ea384c';
    case 'high':
      return '#F97316';
    case 'medium':
      return '#0EA5E9';
    case 'low':
      return '#4ADE80';
    default:
      return '#9333EA';
  }
};

export const OutlierChart = ({ data }: OutlierChartProps) => {
  return (
    <div className="h-[300px] -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#9333EA" stopOpacity={0.2}/>
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
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);
              const timeOfDay = getTimeOfDay(date.getHours());
              return `${format(date, 'MMM d')} ${timeOfDay}`;
            }}
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
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill="url(#barGradient)"
              >
                {/* Severity indicator dot on top of each bar */}
                <circle
                  cx="50%"
                  cy={0}
                  r={4}
                  fill={getSeverityColor(entry.severity)}
                  className="animate-pulse"
                />
              </Cell>
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
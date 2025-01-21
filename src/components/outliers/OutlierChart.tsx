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
      return 'risk-critical';
    case 'high':
      return 'risk-high';
    case 'medium':
      return 'risk-medium';
    case 'low':
      return 'risk-low';
    default:
      return 'risk-medium';
  }
};

const getSeverityGlow = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'risk-critical-glow';
    case 'high':
      return 'risk-high-glow';
    case 'medium':
      return 'risk-medium-glow';
    case 'low':
      return 'risk-low-glow';
    default:
      return 'risk-medium-glow';
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
                <circle
                  cx="50%"
                  cy={0}
                  r={4}
                  className={`animate-pulse bg-${getSeverityColor(entry.severity)} shadow-lg shadow-${getSeverityGlow(entry.severity)}`}
                />
              </Cell>
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
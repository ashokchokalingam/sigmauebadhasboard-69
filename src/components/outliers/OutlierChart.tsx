import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

const formatAxisTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const timeOfDay = getTimeOfDay(date.getHours());
    return `${format(date, 'MMM d')} - ${timeOfDay}`;
  } catch (e) {
    console.error('Error formatting axis date:', e);
    return timestamp;
  }
};

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  const severityColors = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#10B981",
    informational: "#60A5FA"
  };
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={severityColors[payload.severity.toLowerCase()] || "#60A5FA"} 
      className="cursor-pointer hover:r-6 transition-all duration-300"
    />
  );
};

export const OutlierChart = ({ data }: OutlierChartProps) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="timestamp" 
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fill: '#E2E8F0' }}
            tickFormatter={formatAxisTimestamp}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<OutlierTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            name="Anomaly Count"
            stroke="#9333EA"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
            dot={<CustomizedDot />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
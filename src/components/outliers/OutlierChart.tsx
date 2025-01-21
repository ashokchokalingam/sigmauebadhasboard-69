import { Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { ChartDataPoint } from "./types";
import { OutlierTooltip } from "./OutlierTooltip";

// Dummy data generation
const generateDummyData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.unshift({
      timestamp: date.toISOString(),
      high: Math.floor(Math.random() * 5),
      medium: Math.floor(Math.random() * 15),
      low: Math.floor(Math.random() * 10),
      risk: Math.random() * 100,
    });
  }
  
  return data;
};

const dummyData = generateDummyData(14); // 2 weeks of data

interface OutlierChartProps {
  data: ChartDataPoint[];
}

export const OutlierChart = ({ data }: OutlierChartProps) => {
  return (
    <div className="h-[300px] -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={dummyData}
          margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="timestamp"
            stroke="#94A3B8"
            tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
          />
          <YAxis yAxisId="left" stroke="#94A3B8" />
          <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" />
          <Tooltip content={<OutlierTooltip />} />
          
          <Bar dataKey="high" fill="#FF4444" yAxisId="left" />
          <Bar dataKey="medium" fill="#FFA500" yAxisId="left" />
          <Bar dataKey="low" fill="#4ADE80" yAxisId="left" />
          <Line 
            type="monotone" 
            dataKey="risk" 
            stroke="#8884d8" 
            yAxisId="right"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
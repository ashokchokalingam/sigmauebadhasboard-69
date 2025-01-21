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
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#9333EA" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A855F7" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#9333EA" stopOpacity={0.8}/>
            </linearGradient>
            <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C084FC" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#A855F7" stopOpacity={0.8}/>
            </linearGradient>
            <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D8B4FE" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#C084FC" stopOpacity={0.8}/>
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
          />
          <Tooltip content={<OutlierTooltip />} />
          
          <Bar 
            dataKey="high" 
            fill="url(#highGradient)" 
            yAxisId="left"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar 
            dataKey="medium" 
            fill="url(#mediumGradient)" 
            yAxisId="left"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar 
            dataKey="low" 
            fill="url(#lowGradient)" 
            yAxisId="left"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Line 
            type="monotone" 
            dataKey="risk" 
            stroke="url(#riskGradient)"
            strokeWidth={3}
            yAxisId="right"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
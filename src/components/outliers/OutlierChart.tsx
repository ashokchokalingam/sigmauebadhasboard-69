import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ComposedChart, Scatter } from "recharts";
import { format } from "date-fns";
import { ChartDataPoint } from "./types";
import { OutlierTooltip } from "./OutlierTooltip";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

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
  const [chartType, setChartType] = useState<'stacked' | 'composed' | 'scatter'>('stacked');
  
  const renderStackedAreaChart = () => (
    <AreaChart 
      data={dummyData}
      margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
    >
      <defs>
        <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#FF4444" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#FF4444" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#FFA500" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#FFA500" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
        </linearGradient>
      </defs>
      
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
      <XAxis 
        dataKey="timestamp"
        stroke="#94A3B8"
        tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
      />
      <YAxis stroke="#94A3B8" />
      <Tooltip content={<OutlierTooltip />} />
      
      <Area
        type="monotone"
        dataKey="high"
        stackId="1"
        stroke="#FF4444"
        fill="url(#colorHigh)"
      />
      <Area
        type="monotone"
        dataKey="medium"
        stackId="1"
        stroke="#FFA500"
        fill="url(#colorMedium)"
      />
      <Area
        type="monotone"
        dataKey="low"
        stackId="1"
        stroke="#4ADE80"
        fill="url(#colorLow)"
      />
    </AreaChart>
  );

  const renderComposedChart = () => (
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
      <Line type="monotone" dataKey="risk" stroke="#8884d8" yAxisId="right" />
    </ComposedChart>
  );

  const renderScatterChart = () => (
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
      <YAxis stroke="#94A3B8" />
      <Tooltip content={<OutlierTooltip />} />
      
      <Scatter name="High" dataKey="high" fill="#FF4444" />
      <Scatter name="Medium" dataKey="medium" fill="#FFA500" />
      <Scatter name="Low" dataKey="low" fill="#4ADE80" />
      <Line type="monotone" dataKey="risk" stroke="#8884d8" dot={false} />
    </ComposedChart>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'stacked':
        return renderStackedAreaChart();
      case 'composed':
        return renderComposedChart();
      case 'scatter':
        return renderScatterChart();
      default:
        return renderStackedAreaChart();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Toggle
          pressed={chartType === 'stacked'}
          onPressedChange={() => setChartType('stacked')}
          className="data-[state=on]:bg-purple-800"
        >
          Stacked Area
        </Toggle>
        <Toggle
          pressed={chartType === 'composed'}
          onPressedChange={() => setChartType('composed')}
          className="data-[state=on]:bg-purple-800"
        >
          Composed
        </Toggle>
        <Toggle
          pressed={chartType === 'scatter'}
          onPressedChange={() => setChartType('scatter')}
          className="data-[state=on]:bg-purple-800"
        >
          Scatter
        </Toggle>
      </div>
      
      <div className="h-[300px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
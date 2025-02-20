
import React from 'react';
import { Bar, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartDataPoint } from "./types";
import { OutlierTooltip } from "./OutlierTooltip";
import { Toggle } from "@/components/ui/toggle";
import { formatDateTime } from "@/utils/dateTimeUtils";

interface OutlierChartProps {
  data: ChartDataPoint[];
}

export const OutlierChart = ({ data }: OutlierChartProps) => {
  const [selectedSeverities, setSelectedSeverities] = React.useState<string[]>([
    'critical', 'high', 'medium', 'low'
  ]);

  const filteredData = data.filter(entry => 
    selectedSeverities.includes(entry.severity.toLowerCase())
  );

  const handleSeverityToggle = (severity: string) => {
    setSelectedSeverities(prev => {
      if (prev.includes(severity)) {
        return prev.filter(s => s !== severity);
      }
      return [...prev, severity];
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#D32F2F';
      case 'high':
        return '#FF5722';
      case 'medium':
        return '#FFB74D';
      case 'low':
        return '#66BB6A';
      default:
        return '#9333EA';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        {['Critical', 'High', 'Medium', 'Low'].map(severity => (
          <Toggle
            key={severity}
            pressed={selectedSeverities.includes(severity.toLowerCase())}
            onPressedChange={() => handleSeverityToggle(severity.toLowerCase())}
            className={`
              data-[state=on]:bg-opacity-20 data-[state=on]:text-opacity-100
              text-opacity-50 hover:text-opacity-75 transition-opacity
            `}
            style={{
              backgroundColor: selectedSeverities.includes(severity.toLowerCase()) 
                ? getSeverityColor(severity) + '33'
                : 'transparent',
              color: getSeverityColor(severity),
              borderColor: getSeverityColor(severity) + '40'
            }}
          >
            {severity}
          </Toggle>
        ))}
      </div>

      <div className="h-[400px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
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
              tickFormatter={(timestamp) => formatDateTime(timestamp, false)}
              tick={{ 
                fill: '#D8B4FE', 
                fontSize: 14 
              }}
              height={60}
              tickMargin={30}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              stroke="#D8B4FE"
              tick={{ fill: '#D8B4FE', fontSize: 14 }}
            />
            <Tooltip 
              content={<OutlierTooltip />}
              cursor={false}
              position={{ x: 0, y: 0 }}
              wrapperStyle={{ outline: 'none' }}
            />
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
    </div>
  );
};

export default OutlierChart;

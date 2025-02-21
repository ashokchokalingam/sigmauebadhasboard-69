
import React from 'react';
import { Bar, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartDataPoint } from "./types";
import { OutlierTooltip } from "./OutlierTooltip";
import { Toggle } from "@/components/ui/toggle";
import { formatDateTime } from "@/utils/dateTimeUtils";
import { format } from "date-fns";

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

  const getSeverityColor = (severity: string, risk: number) => {
    // First check the severity level
    const severityLevel = severity.toLowerCase();
    if (severityLevel === 'critical') return '#D32F2F';
    if (severityLevel === 'high') return '#FF5722';
    if (severityLevel === 'medium') return '#FFB74D';
    if (severityLevel === 'low') return '#66BB6A';
    
    // If no specific severity, fall back to risk-based coloring
    if (risk >= 150) return '#D32F2F';
    if (risk >= 100) return '#FF5722';
    if (risk >= 50) return '#FFB74D';
    return '#66BB6A';
  };

  const formatXAxisDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, 'MMM d, HH:mm');
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
                ? getSeverityColor(severity, 0) + '33'
                : 'transparent',
              color: getSeverityColor(severity, 0),
              borderColor: getSeverityColor(severity, 0) + '40'
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
              {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
                <linearGradient
                  key={severity}
                  id={`${severity.toLowerCase()}Gradient`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={getSeverityColor(severity, 0)}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={getSeverityColor(severity, 0)}
                    stopOpacity={0.2}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(147, 51, 234, 0.1)" 
              vertical={false}
            />
            <XAxis 
              dataKey="timestamp"
              stroke="#D8B4FE"
              tickFormatter={formatXAxisDate}
              tick={{ 
                fill: '#D8B4FE', 
                fontSize: 13,
                fontWeight: 500
              }}
              height={80}
              tickMargin={35}
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
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={`url(#${entry.severity.toLowerCase()}Gradient)`}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OutlierChart;

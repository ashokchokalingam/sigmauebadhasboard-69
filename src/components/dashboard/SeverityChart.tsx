import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";

interface SeverityChartProps {
  onSeveritySelect: (severity: string | null) => void;
}

const SeverityChart = ({ onSeveritySelect }: SeverityChartProps) => {
  const { data: totalCount } = useQuery({
    queryKey: ['totalCount'],
    queryFn: async () => {
      const response = await fetch('/api/total_count');
      if (!response.ok) {
        throw new Error('Failed to fetch total count');
      }
      const data = await response.json();
      return data;
    }
  });

  const severityData = totalCount?.total_counts?.filter(count => 
    count.rule_level !== "Total"
  )?.map(count => ({
    name: count.rule_level,
    value: parseInt(count.event_count),
    color: count.rule_level === "Critical" ? "#ea384c" : // Red for Critical
           count.rule_level === "High" ? "#F97316" :     // Orange for High
           count.rule_level === "Medium" ? "#3B82F6" :   // Blue for Medium
           count.rule_level === "Low" ? "#22C55E" :      // Green for Low
           "#3B82F6"                                     // Default blue
  })) || [];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <g>
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {value}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1a1f2c]/95 border border-gray-700 rounded-lg p-2 shadow-lg">
          <p className="text-gray-200 font-medium">{data.name}</p>
          <p className="text-gray-300">
            {data.value.toLocaleString()} events
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#0F1218] border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-200">Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                onMouseEnter={(data) => {
                  if (data && data.name) {
                    onSeveritySelect(data.name);
                  }
                }}
                onMouseLeave={() => {
                  onSeveritySelect(null);
                }}
              >
                {severityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="#0F1218"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pt-4">
            {severityData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-sm text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeverityChart;
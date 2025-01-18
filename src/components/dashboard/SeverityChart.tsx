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
    color: count.rule_level === "Critical" ? "#FF3B30" : // Bright Red
           count.rule_level === "High" ? "#FF9500" : // Orange
           count.rule_level === "Medium" ? "#FFCC00" : // Yellow
           count.rule_level === "Low" ? "#34C759" : // Green
           "#007AFF", // Blue (Informational)
    gradient: count.rule_level === "Critical" ? ["#FF3B30", "#FF8A80"] :
              count.rule_level === "High" ? ["#FF9500", "#FFB74D"] :
              count.rule_level === "Medium" ? ["#FFCC00", "#FFE082"] :
              count.rule_level === "Low" ? ["#34C759", "#69F0AE"] :
              ["#007AFF", "#64B5F6"]
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
          className="text-xs font-medium drop-shadow-lg"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
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
        <div className="bg-[#1a1f2c]/95 border border-gray-700 rounded-lg p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ 
                background: `linear-gradient(135deg, ${data.gradient[0]}, ${data.gradient[1]})`,
                boxShadow: `0 0 10px ${data.gradient[0]}50`
              }}
            />
            <p className="text-gray-200 font-medium text-lg">{data.name}</p>
          </div>
          <p className="text-gray-300 font-mono text-xl">
            {data.value.toLocaleString()} events
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {(payload[0].percent * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-100">
          <AlertTriangle className="h-5 w-5 text-blue-500" />
          Risk Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {severityData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${entry.name}`}>
                    <stop offset="0%" stopColor={entry.gradient[0]} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.gradient[1]} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={160}
                paddingAngle={4}
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
                startAngle={90}
                endAngle={-270}
              >
                {severityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${entry.name})`}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={2}
                    className="transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      filter: 'drop-shadow(0px 6px 8px rgba(0, 0, 0, 0.4))',
                      transformOrigin: 'center'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 pt-4">
            {severityData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${entry.gradient[0]}, ${entry.gradient[1]})`,
                    boxShadow: `0 0 10px ${entry.gradient[0]}50`
                  }} 
                />
                <span className="text-sm text-gray-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeverityChart;
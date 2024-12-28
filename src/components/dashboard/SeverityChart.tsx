import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const severityData = [
  { name: "Critical", value: 45, color: "#EF4444" },
  { name: "High", value: 35, color: "#F97316" },
  { name: "Medium", value: 15, color: "#FBBF24" },
  { name: "Low", value: 5, color: "#34D399" },
];

const SeverityChart = () => {
  return (
    <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-100">
          <AlertTriangle className="h-5 w-5 text-blue-500" />
          Risk Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 31, 44, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #3B82F6',
                  color: '#E5DEFF',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {severityData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-xs text-blue-200">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeverityChart;
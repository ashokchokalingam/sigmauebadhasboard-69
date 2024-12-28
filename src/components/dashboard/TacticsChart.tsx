import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const alertData = [
  { name: "Initial Access", alerts: 24, color: "#0EA5E9" },
  { name: "Execution", alerts: 13, color: "#0284C7" },
  { name: "Persistence", alerts: 18, color: "#0369A1" },
  { name: "Privilege Escalation", alerts: 28, color: "#1E40AF" },
  { name: "Defense Evasion", alerts: 35, color: "#1D4ED8" },
  { name: "Credential Access", alerts: 22, color: "#2563EB" },
  { name: "Discovery", alerts: 19, color: "#3B82F6" },
  { name: "Lateral Movement", alerts: 31, color: "#60A5FA" },
];

const TacticsChart = () => {
  return (
    <Card className="bg-black/40 border-[#60A5FA]/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#E5DEFF]/90">
          <Activity className="h-5 w-5 text-[#60A5FA]" />
          MITRE ATT&CK Tactics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alertData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                stroke="#666"
                tick={{ fill: '#E5DEFF', fontSize: 12 }}
              />
              <YAxis 
                stroke="#666"
                tick={{ fill: '#E5DEFF', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 31, 44, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #60A5FA',
                  color: '#E5DEFF',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Bar 
                dataKey="alerts"
                radius={[4, 4, 0, 0]}
              >
                {alertData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TacticsChart;
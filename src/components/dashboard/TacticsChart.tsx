import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const alertData = [
  { name: "Initial Access", alerts: 24, color: "#9b87f5" },
  { name: "Execution", alerts: 13, color: "#7E69AB" },
  { name: "Persistence", alerts: 18, color: "#6E59A5" },
  { name: "Privilege Escalation", alerts: 28, color: "#8B5CF6" },
  { name: "Defense Evasion", alerts: 35, color: "#E5DEFF" },
  { name: "Credential Access", alerts: 22, color: "#0EA5E9" },
  { name: "Discovery", alerts: 19, color: "#1EAEDB" },
  { name: "Lateral Movement", alerts: 31, color: "#33C3F0" },
];

const TacticsChart = () => {
  return (
    <Card className="bg-black/40 border-[#9b87f5]/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#E5DEFF]/90">
          <Activity className="h-5 w-5 text-[#9b87f5]" />
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
                  border: '1px solid #9b87f5',
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
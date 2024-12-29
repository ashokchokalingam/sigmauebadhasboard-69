import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Alert {
  tags: string;
}

interface TacticsChartProps {
  alerts: Alert[];
  onTacticSelect: (tactic: string | null) => void;
}

const TacticsChart = ({ alerts, onTacticSelect }: TacticsChartProps) => {
  const calculateTacticsData = () => {
    const tacticsCount: { [key: string]: number } = {};
    
    alerts.forEach(alert => {
      if (alert.tags) {
        const tags = alert.tags.split(',').map(t => t.trim());
        const tactics = tags.filter(tag => 
          tag.startsWith('attack.') && 
          !tag.toLowerCase().includes('t1')
        ).map(tag => tag.replace('attack.', ''));
        
        tactics.forEach(tactic => {
          tacticsCount[tactic] = (tacticsCount[tactic] || 0) + 1;
        });
      }
    });

    return Object.entries(tacticsCount)
      .map(([name, count]) => ({ name, alerts: count }))
      .sort((a, b) => b.alerts - a.alerts)
      .slice(0, 6);
  };

  const alertData = calculateTacticsData();
  const blueColors = [
    "#0EA5E9", "#0284C7", "#0369A1", "#1E40AF",
    "#1D4ED8", "#2563EB"
  ];

  return (
    <Card className="bg-black/40 border-[#60A5FA]/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#E5DEFF]/90">
          <Activity className="h-5 w-5 text-[#60A5FA]" />
          MITRE ATT&CK Tactics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={alertData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis 
                type="number"
                stroke="#666"
                tick={{ fill: '#E5DEFF', fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="name"
                stroke="#666"
                tick={{ fill: '#E5DEFF', fontSize: 12 }}
                width={90}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 31, 44, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #60A5FA',
                  color: '#E5DEFF',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                cursor={{ fill: 'rgba(96, 165, 250, 0.1)' }}
                formatter={(value: number) => [`${value} Alerts`, 'Count']}
                labelStyle={{ color: '#E5DEFF', fontWeight: 'bold' }}
              />
              <Bar 
                dataKey="alerts"
                radius={[0, 4, 4, 0]}
                onClick={(data) => onTacticSelect(data.name)}
              >
                {alertData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={blueColors[index % blueColors.length]}
                    className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  />
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
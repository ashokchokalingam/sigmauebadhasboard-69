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
      .map(([name, count]) => ({ name: name.replace(/_/g, ' '), value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1f2c] border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-200 font-medium capitalize">{label}</p>
          <p className="text-gray-300 font-mono">{payload[0].value} alerts</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-100">
          <Activity className="h-5 w-5 text-blue-500" />
          MITRE ATT&CK Tactics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={calculateTacticsData()}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
              barSize={32}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#333" 
                horizontal={true}
                vertical={false}
              />
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
                width={120}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ 
                  fill: 'rgba(96, 165, 250, 0.15)',
                  strokeWidth: 1,
                  stroke: 'rgba(96, 165, 250, 0.3)'
                }}
              />
              <Bar 
                dataKey="value"
                fill="url(#barGradient)"
                radius={[0, 4, 4, 0]}
                onClick={(data) => onTacticSelect(data.name)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TacticsChart;
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

    const colors = [
      '#8B5CF6', // Vivid Purple
      '#D946EF', // Magenta Pink
      '#F97316', // Bright Orange
      '#0EA5E9', // Ocean Blue
      '#1EAEDB', // Bright Blue
      '#33C3F0', // Sky Blue
      '#0FA0CE'  // Another Bright Blue
    ];

    return Object.entries(tacticsCount)
      .map(([name, value], index) => ({ 
        name: name.replace(/_/g, ' '),
        value,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1f2c] border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-200 font-medium text-lg capitalize">{label}</p>
          <p className="text-gray-300 font-mono text-base">{payload[0].value} alerts</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-blue-100">
          <Activity className="h-6 w-6 text-blue-500" />
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
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#333" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                type="number"
                stroke="#666"
                tick={{ fill: '#E5DEFF', fontSize: 14 }}
                domain={[0, 'auto']}
              />
              <YAxis 
                type="category"
                dataKey="name"
                stroke="#666"
                tick={{ fill: '#E5DEFF', fontSize: 14 }}
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
                radius={[0, 4, 4, 0]}
                onClick={(data) => onTacticSelect(data.name)}
              >
                {calculateTacticsData().map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    fillOpacity={0.9}
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
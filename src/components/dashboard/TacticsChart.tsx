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

    // Rich color palette with deep, saturated colors
    const colors = [
      '#403E43',  // Charcoal Gray
      '#6E59A5',  // Tertiary Purple
      '#0EA5E9',  // Ocean Blue
      '#F97316',  // Bright Orange
      '#059669',  // Emerald
      '#1A1F2C',  // Dark Purple
      '#DC2626',  // Red
      '#7E69AB',  // Secondary Purple
      '#9b87f5',  // Primary Purple
      '#D97706',  // Amber
      '#0FA0CE',  // Bright Blue
      '#8B5CF6'   // Vivid Purple
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
        <div className="bg-[#1a1f2c] border border-[#403E43] rounded-lg p-4 shadow-xl">
          <p className="text-[#9b87f5] font-bold text-xl capitalize">{label}</p>
          <p className="text-[#7E69AB] font-mono text-lg">{payload[0].value} alerts</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#1A1F2C]/90 border-[#403E43] hover:bg-[#1A1F2C] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-3xl font-bold text-[#9b87f5]">
          <Activity className="h-8 w-8 text-[#7E69AB]" />
          MITRE ATT&CK Tactics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={calculateTacticsData()}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
              barSize={36}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#403E43" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                type="number"
                stroke="#6E59A5"
                tick={{ fill: '#9b87f5', fontSize: 16 }}
                domain={[0, 'auto']}
              />
              <YAxis 
                type="category"
                dataKey="name"
                stroke="#6E59A5"
                tick={{ fill: '#9b87f5', fontSize: 16 }}
                width={140}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ 
                  fill: 'rgba(155, 135, 245, 0.15)',
                  strokeWidth: 1,
                  stroke: 'rgba(155, 135, 245, 0.3)'
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
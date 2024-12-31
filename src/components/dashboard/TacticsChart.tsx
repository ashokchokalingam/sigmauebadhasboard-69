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
      .map(([name, count]) => ({ name: name.replace(/_/g, ' '), alerts: count }))
      .sort((a, b) => b.alerts - a.alerts)
      .slice(0, 8);
  };

  const alertData = calculateTacticsData();
  const gradientColors = [
    "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8",
    "#1E40AF", "#1E3A8A", "#1E3A8A", "#172554"
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1f2c] border border-blue-500/30 rounded-lg p-3 shadow-lg">
          <p className="text-blue-100 font-medium mb-1 capitalize">{label}</p>
          <p className="text-blue-300 font-mono">
            {payload[0].value.toLocaleString()} alerts
          </p>
        </div>
      );
    }
    return null;
  };

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
            <BarChart 
              data={alertData}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              barSize={32}
            >
              <defs>
                {gradientColors.map((color, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={color} stopOpacity={1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#333" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="name"
                stroke="#666"
                tick={{ fill: '#E5DEFF', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                stroke="#666"
                tick={{ fill: '#E5DEFF', fontSize: 12 }}
                width={60}
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
                dataKey="alerts"
                radius={[4, 4, 0, 0]}
                onClick={(data) => onTacticSelect(data.name)}
              >
                {alertData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`}
                    className="transition-opacity duration-200 cursor-pointer hover:opacity-90 active:opacity-75"
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
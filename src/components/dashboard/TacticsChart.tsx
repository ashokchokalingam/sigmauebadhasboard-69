import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";

interface TacticsChartProps {
  onTacticSelect: (tactic: string | null) => void;
}

interface TagData {
  tags: string;
  total_count: number;
}

const TacticsChart = ({ onTacticSelect }: TacticsChartProps) => {
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      const data = await response.json();
      return data.tags as TagData[];
    }
  });

  const calculateTacticsData = () => {
    if (!tagsData) return [];

    const tacticsCount: { [key: string]: number } = {};
    
    tagsData.forEach((tagData: TagData) => {
      const tags = tagData.tags.split(', ');
      tags.forEach(tag => {
        // Only process tags that start with 'attack.' and don't include 't1' (case insensitive)
        if (tag.startsWith('attack.') && !tag.toLowerCase().includes('t1')) {
          const tacticName = tag.replace('attack.', '')
                               .replace(/-/g, ' ')
                               .split(' ')
                               .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                               .join(' ');
          tacticsCount[tacticName] = (tacticsCount[tacticName] || 0) + tagData.total_count;
        }
      });
    });

    const colors = [
      '#7C3AED',  // Purple for Initial Access
      '#4C6EF5',  // Blue for Persistence
      '#22C55E',  // Green for Impact
      '#F97316',  // Orange for Credential Access
      '#6366F1',  // Indigo for Execution
      '#3B82F6',  // Blue for Privilege Escalation
      '#2563EB',  // Royal Blue for Defense Evasion
    ];

    return Object.entries(tacticsCount)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 shadow-xl">
          <p className="text-[#94A3B8] font-bold text-xl capitalize">{label}</p>
          <p className="text-[#CBD5E1] font-mono text-lg">{payload[0].value.toLocaleString()} alerts</p>
        </div>
      );
    }
    return null;
  };

  const chartData = calculateTacticsData();

  return (
    <Card className="bg-[#0F172A] border-[#334155] hover:bg-[#1E293B] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-3xl font-bold text-[#E2E8F0]">
          <Activity className="h-8 w-8 text-[#7B61FF]" />
          MITRE ATT&CK Tactics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
              barSize={36}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#334155" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                type="number"
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 14 }}
                domain={[0, 'auto']}
              />
              <YAxis 
                type="category"
                dataKey="name"
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 14 }}
                width={140}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ 
                  fill: 'rgba(123, 97, 255, 0.15)',
                  strokeWidth: 1,
                  stroke: 'rgba(123, 97, 255, 0.3)'
                }}
              />
              <Bar 
                dataKey="value"
                radius={[0, 4, 4, 0]}
                onClick={(data) => onTacticSelect(data.name)}
              >
                {chartData.map((entry, index) => (
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
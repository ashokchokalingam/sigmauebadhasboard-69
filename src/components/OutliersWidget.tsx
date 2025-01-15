import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Outlier {
  count: number;
  severity: "high" | "medium" | "low";
  type: string;
  timestamp: string;
}

const OutliersWidget = () => {
  const { data: outliers } = useQuery({
    queryKey: ['outliers'],
    queryFn: async () => {
      // Simulated data - replace with actual API endpoint when available
      return [
        { timestamp: 'Event 2', count: 45, severity: "high", type: "Non Interactive PowerShell Process Spawned" },
        { timestamp: 'Event 4', count: 20, severity: "high", type: "Remote PowerShell Session Host Process (WinRM)" },
        { timestamp: 'Event 6', count: 15, severity: "medium", type: "Dynamic .NET Compilation Via Csc.EXE - Hunting" },
        { timestamp: 'Event 8', count: 8, severity: "medium", type: "Suspicious Process Creation" },
        { timestamp: 'Event 10', count: 2, severity: "low", type: "Unusual Network Connection" },
        { timestamp: 'Event 12', count: 1, severity: "low", type: "Abnormal System Behavior" }
      ] as Outlier[];
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-[#FF0000]";
      case "medium": return "text-[#FFA500]";
      default: return "text-[#008000]";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-950";
      case "medium": return "bg-orange-950";
      default: return "bg-green-950";
    }
  };

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <AlertOctagon className="h-5 w-5 text-purple-500" />
          ML Outliers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={outliers}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="timestamp" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                labelStyle={{ color: '#E5E7EB' }}
                itemStyle={{ color: '#9333EA' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#9333EA"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3 mt-4">
          {outliers?.map((outlier, index) => (
            <div
              key={index}
              className={`${getSeverityBg(outlier.severity)} p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-200 font-medium">{outlier.type}</span>
                <span className={`${getSeverityColor(outlier.severity)} font-bold`}>
                  {outlier.count} events
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutliersWidget;
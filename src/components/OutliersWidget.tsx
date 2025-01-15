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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 p-4 rounded-lg border border-purple-500/20 backdrop-blur-sm">
        <p className="text-purple-300 font-medium mb-2">{data.type}</p>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Count:</span>
          <span className="text-white font-bold">{data.count}</span>
        </div>
        <div className="mt-1 text-sm text-purple-400/80">
          {data.timestamp}
        </div>
      </div>
    );
  }
  return null;
};

const OutliersWidget = () => {
  const { data: outliers } = useQuery({
    queryKey: ['outliers'],
    queryFn: async () => {
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

  const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="#9333EA" />
        <text
          x={cx}
          y={cy - 15}
          textAnchor="middle"
          fill="#E9D5FF"
          fontSize="12"
          className="font-medium"
        >
          {payload.count}
        </text>
      </g>
    );
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
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={outliers}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="timestamp" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#9333EA"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
                dot={<CustomizedDot />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outliers?.map((outlier, index) => (
            <div
              key={index}
              className={`
                px-4 py-3 rounded-lg 
                ${outlier.severity === 'high' ? 'bg-red-950/50 text-red-400' : 
                  outlier.severity === 'medium' ? 'bg-orange-950/50 text-orange-400' : 
                  'bg-green-950/50 text-green-400'}
                hover:bg-opacity-75 transition-all duration-300
                border border-purple-500/20
              `}
            >
              <div className="text-sm font-medium truncate">{outlier.type}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutliersWidget;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Outlier {
  count: number;
  severity: "high" | "medium" | "low";
  type: string;
  timestamp: string;
  tactic?: string;
  technique?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 p-4 rounded-lg border border-purple-500/20 backdrop-blur-sm">
        <p className="text-purple-300 font-medium mb-2">{data.type}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Count:</span>
            <span className="text-white font-bold">{data.count}</span>
          </div>
          {data.tactic && (
            <div className="flex items-center gap-2">
              <span className="text-purple-400">Tactic:</span>
              <span className="text-white">{data.tactic}</span>
            </div>
          )}
          {data.technique && (
            <div className="flex items-center gap-2">
              <span className="text-purple-400">Technique:</span>
              <span className="text-white">{data.technique}</span>
            </div>
          )}
          <div className="mt-1 text-sm text-purple-400/80">
            {data.timestamp}
          </div>
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
        { 
          timestamp: 'Event 2', 
          count: 45, 
          severity: "high", 
          type: "Non Interactive PowerShell Process Spawned",
          tactic: "Execution",
          technique: "T1059.001 - PowerShell"
        },
        { 
          timestamp: 'Event 4', 
          count: 20, 
          severity: "high", 
          type: "Remote PowerShell Session Host Process (WinRM)",
          tactic: "Lateral Movement",
          technique: "T1021.006 - Windows Remote Management"
        },
        { 
          timestamp: 'Event 6', 
          count: 15, 
          severity: "medium", 
          type: "Dynamic .NET Compilation Via Csc.EXE - Hunting",
          tactic: "Defense Evasion",
          technique: "T1027.004 - Compile After Delivery"
        },
        { 
          timestamp: 'Event 8', 
          count: 8, 
          severity: "medium", 
          type: "Suspicious Process Creation",
          tactic: "Execution",
          technique: "T1204 - User Execution"
        },
        { 
          timestamp: 'Event 10', 
          count: 2, 
          severity: "low", 
          type: "Unusual Network Connection",
          tactic: "Command and Control",
          technique: "T1071 - Application Layer Protocol"
        },
        { 
          timestamp: 'Event 12', 
          count: 1, 
          severity: "low", 
          type: "Abnormal System Behavior",
          tactic: "Discovery",
          technique: "T1082 - System Information Discovery"
        }
      ] as Outlier[];
    }
  });

  const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    
    return (
      <g>
        <circle 
          cx={cx} 
          cy={cy} 
          r={4} 
          fill="#9333EA" 
          className="cursor-pointer hover:r-6 transition-all duration-300"
        />
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
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill="#9333EA"
          fontSize="10"
          className="font-medium"
        >
          {payload.tactic}
        </text>
        <text
          x={cx}
          y={cy + 35}
          textAnchor="middle"
          fill="#9333EA"
          fontSize="9"
          className="font-medium opacity-75"
        >
          {payload.technique?.split(' ')[0]}
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
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={outliers}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
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
      </CardContent>
    </Card>
  );
};

export default OutliersWidget;
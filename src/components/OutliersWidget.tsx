import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Outlier {
  count: number;
  severity: "high" | "medium" | "low";
  type: string;
  timestamp: string;
  tactic?: string;
  technique?: string;
  risk_score?: number;
  users_impacted?: number;
  trend_percentage?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 p-4 rounded-lg border border-purple-500/20 backdrop-blur-sm">
        <p className="text-purple-300 font-medium mb-2">{data.tactic}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Anomalies:</span>
            <span className="text-white font-bold">{data.count}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Risk Score:</span>
            <span className="text-white font-bold">{data.risk_score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Users Impacted:</span>
            <span className="text-white">{data.users_impacted}</span>
          </div>
          {data.trend_percentage && (
            <div className="flex items-center gap-2">
              <span className="text-purple-400">Trend:</span>
              <span className={`font-bold ${data.trend_percentage > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {data.trend_percentage > 0 ? '↑' : '↓'} {Math.abs(data.trend_percentage)}%
              </span>
            </div>
          )}
          {data.technique && (
            <div className="flex items-center gap-2">
              <span className="text-purple-400">Technique:</span>
              <span className="text-white">{data.technique}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;
  const severity = payload.severity || "medium";
  
  const severityColors = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#10B981"
  };
  
  return (
    <g>
      {/* Point circle */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={severityColors[severity]} 
        className="cursor-pointer hover:r-6 transition-all duration-300"
      />
      
      {/* Risk Score and Count */}
      <text
        x={cx}
        y={cy - 35}
        textAnchor="middle"
        fill="#E9D5FF"
        fontSize="14"
        className="font-bold"
      >
        {`Risk: ${payload.risk_score || 0}`}
      </text>
      
      {/* Count and Type */}
      <text
        x={cx}
        y={cy - 20}
        textAnchor="middle"
        fill="#9333EA"
        fontSize="11"
        className="font-medium"
      >
        {`${payload.count} ${payload.type}`}
      </text>
      
      {/* Technique */}
      <text
        x={cx}
        y={cy - 5}
        textAnchor="middle"
        fill="#9333EA"
        fontSize="10"
        className="font-medium opacity-75"
      >
        {payload.technique}
      </text>
    </g>
  );
};

const OutliersWidget = () => {
  const { data: outliers } = useQuery({
    queryKey: ['ml-outliers'],
    queryFn: async () => {
      const response = await fetch('/api/ml_outliers_title');
      if (!response.ok) {
        throw new Error('Failed to fetch outliers data');
      }
      return response.json();
    }
  });

  const totalHighRiskEvents = outliers?.filter((o: Outlier) => o.severity === "high").length || 0;
  const totalUsersImpacted = outliers?.reduce((acc: number, curr: Outlier) => acc + (curr.users_impacted || 0), 0) || 0;

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <AlertOctagon className="h-5 w-5 text-purple-500" />
          ML Outliers - Last 7 Days
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <AlertOctagon className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-sm text-purple-200">High Risk Events</p>
              <p className="text-lg font-bold text-purple-100">{totalHighRiskEvents}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <Users className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-200">Users Impacted</p>
              <p className="text-lg font-bold text-purple-100">{totalUsersImpacted}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <TrendingUp className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-sm text-purple-200">Risk Trend</p>
              <p className="text-lg font-bold text-purple-100">
                {outliers?.[0]?.trend_percentage > 0 ? '↑' : '↓'} {Math.abs(outliers?.[0]?.trend_percentage || 0)}%
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={outliers}
              margin={{ top: 60, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="tactic" 
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
        {outliers && outliers.length > 0 && (
          <div className="mt-4 p-4 bg-purple-900/20 rounded-lg">
            <p className="text-purple-200 text-sm">
              Key Insight: The {outliers[0].tactic} tactic shows the highest risk with {outliers[0].count} anomalies. 
              {outliers[0].type && ` Primary concern: ${outliers[0].type} activity.`}
              {outliers[0].risk_score && ` Risk score: ${outliers[0].risk_score}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutliersWidget;
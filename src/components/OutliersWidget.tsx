import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon, TrendingUp, Users, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { format } from "date-fns";

interface MLOutlier {
  event_count: number;
  event_title: string;
  first_seen: string;
  last_seen: string;
  risk_level: "high" | "medium" | "low";
  tactics: string;
}

interface ChartDataPoint {
  count: number;
  severity: "high" | "medium" | "low";
  type: string;
  timestamp: string;
  tactic: string;
  risk_score: number;
  first_seen: string;
  last_seen: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 p-4 rounded-lg border border-purple-500/20 backdrop-blur-sm">
        <p className="text-purple-300 font-medium mb-2">{data.type}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Anomalies:</span>
            <span className="text-white font-bold">{data.count}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Time:</span>
            <span className="text-white">{format(new Date(data.timestamp), 'PPp')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Tactic:</span>
            <span className="text-white">{data.tactic || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Risk Level:</span>
            <span className={`font-bold ${getSeverityColor(data.severity)}`}>
              {data.severity?.toUpperCase() || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-yellow-400";
    case "low":
      return "text-green-400";
    default:
      return "text-purple-400";
  }
};

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;
  const severity = payload?.severity || "medium";
  
  const severityColors = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#10B981"
  };
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={severityColors[severity]} 
      className="cursor-pointer hover:r-6 transition-all duration-300"
    />
  );
};

const OutliersWidget = () => {
  const { data: apiResponse } = useQuery({
    queryKey: ['outliers'],
    queryFn: async () => {
      const response = await fetch('/api/outliers');
      if (!response.ok) {
        throw new Error('Failed to fetch outliers data');
      }
      const data = await response.json();
      return data.outliers as MLOutlier[];
    }
  });

  const chartData: ChartDataPoint[] = apiResponse?.map((outlier) => ({
    count: outlier.event_count || 0,
    severity: outlier.risk_level || "medium",
    type: outlier.event_title || "Unknown Event",
    timestamp: outlier.first_seen || new Date().toISOString(),
    tactic: outlier.tactics?.split(',')[0] || "Unknown",
    risk_score: 0,
    first_seen: outlier.first_seen || new Date().toISOString(),
    last_seen: outlier.last_seen || new Date().toISOString(),
  })) || [];

  const totalHighRiskEvents = chartData.filter(o => o.severity === "high").length;

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <AlertOctagon className="h-5 w-5 text-purple-500" />
          ML Outliers - Executive Summary
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
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-200">Risk Trend</p>
              <p className="text-lg font-bold text-purple-100">
                {chartData.length > 0 ? 'Decreasing' : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <Shield className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-purple-200">Time Period</p>
              <p className="text-lg font-bold text-purple-100">Last 7 Days</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
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
                tickFormatter={(value) => format(new Date(value), 'MMM dd HH:mm')}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                name="Anomaly Count"
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
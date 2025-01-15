import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon, TrendingUp, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

interface MLOutlier {
  anomaly_count: number;
  first_seen: string;
  impacted_computers: string;
  last_seen: string;
  ml_description: string;
  origin_users: string | null;
  risk: number | null;
  severity: "high" | "medium" | "low" | "informational";
  source_ips: string | null;
  tactics: string | null;
  techniques: string | null;
  title: string;
}

interface ChartDataPoint {
  timestamp: string;
  count: number;
  risk: number;
  severity: string;
  title: string;
  description: string;
  tactics: string[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 p-4 rounded-lg border border-purple-500/20 backdrop-blur-sm">
        <p className="text-purple-300 font-medium mb-2">{data.title}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Anomalies:</span>
            <span className="text-white font-bold">{data.count}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Risk Score:</span>
            <span className="text-white font-bold">{data.risk || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Time:</span>
            <span className="text-white">{format(parseISO(data.timestamp), 'PPp')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Tactics:</span>
            <span className="text-white">{data.tactics.join(', ') || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Severity:</span>
            <span className={`font-bold ${getSeverityColor(data.severity)}`}>
              {data.severity.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-yellow-400";
    case "low":
      return "text-green-400";
    default:
      return "text-blue-400";
  }
};

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  const severityColors = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#10B981",
    informational: "#60A5FA"
  };
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={severityColors[payload.severity.toLowerCase()] || "#60A5FA"} 
      className="cursor-pointer hover:r-6 transition-all duration-300"
    />
  );
};

const OutliersWidget = () => {
  const { data: apiResponse, isLoading } = useQuery({
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
    timestamp: outlier.first_seen,
    count: outlier.anomaly_count,
    risk: outlier.risk || 0,
    severity: outlier.severity,
    title: outlier.title,
    description: outlier.ml_description,
    tactics: outlier.tactics?.split(',') || [],
  })) || [];

  const totalHighRiskEvents = chartData.filter(o => o.severity.toLowerCase() === "high").length;
  const averageRiskScore = Math.round(
    chartData.reduce((acc, curr) => acc + (curr.risk || 0), 0) / (chartData.length || 1)
  );

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-purple-900/20">
        <CardContent className="p-6">
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <p className="text-sm text-purple-200">Critical Events</p>
              <p className="text-lg font-bold text-purple-100">{totalHighRiskEvents}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <TrendingUp className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-sm text-purple-200">Average Risk Score</p>
              <p className="text-lg font-bold text-purple-100">{averageRiskScore}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <Shield className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-200">Total Anomalies</p>
              <p className="text-lg font-bold text-purple-100">
                {chartData.reduce((acc, curr) => acc + curr.count, 0)}
              </p>
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
                tickFormatter={(value) => format(parseISO(value), 'MMM dd HH:mm')}
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
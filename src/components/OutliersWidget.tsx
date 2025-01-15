import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon, TrendingUp, Shield, Monitor, Users } from "lucide-react";
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
  impactedComputers: string[];
  impactedUsers: string[];
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
            <span className="text-white">{format(new Date(data.timestamp), 'MMM d, yyyy h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Impacted Computers:</span>
            <span className="text-white">{data.impactedComputers.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Impacted Users:</span>
            <span className="text-white">{data.impactedUsers.length}</span>
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
    impactedComputers: outlier.impacted_computers?.split(',') || [],
    impactedUsers: (outlier.origin_users || '').split(',').filter(Boolean),
  }))
  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) || [];

  const calculateSeverityStats = () => {
    if (!apiResponse) return { high: 0, medium: 0, low: 0, informational: 0, total: 0 };
    
    const stats = apiResponse.reduce((acc, curr) => {
      acc[curr.severity] = (acc[curr.severity] || 0) + curr.anomaly_count;
      acc.total += curr.anomaly_count;
      return acc;
    }, { high: 0, medium: 0, low: 0, informational: 0, total: 0 });

    return stats;
  };

  const calculateImpactedCounts = () => {
    if (!apiResponse) return { computers: 0, users: 0 };
    
    const uniqueComputers = new Set();
    const uniqueUsers = new Set();
    
    apiResponse.forEach(outlier => {
      if (outlier.impacted_computers) {
        outlier.impacted_computers.split(',').forEach(computer => uniqueComputers.add(computer.trim()));
      }
      if (outlier.origin_users) {
        outlier.origin_users.split(',').forEach(user => uniqueUsers.add(user.trim()));
      }
    });
    
    return {
      computers: uniqueComputers.size,
      users: uniqueUsers.size
    };
  };

  const stats = calculateSeverityStats();
  const impactedCounts = calculateImpactedCounts();
  const mediumPercentage = Math.round((stats.medium / stats.total) * 100);
  const highSeverityCount = stats.high;

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          <div className="md:col-span-2 flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <AlertOctagon className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-sm text-purple-200">Critical Insight</p>
              <p className="text-lg font-bold text-purple-100">
                {highSeverityCount} high-severity anomalies need immediate investigation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <TrendingUp className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-sm text-purple-200">Severity Distribution</p>
              <p className="text-lg font-bold text-purple-100">
                {mediumPercentage}% medium severity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <Monitor className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-purple-200">Impacted Systems</p>
              <p className="text-lg font-bold text-purple-100">
                {impactedCounts.computers} computers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/20 p-3 rounded-lg">
            <Users className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-purple-200">Impacted Users</p>
              <p className="text-lg font-bold text-purple-100">
                {impactedCounts.users} users
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
                stroke="#94A3B8" // Changed from #6B7280 to a lighter slate color
                fontSize={12}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fill: '#E2E8F0' }} // Added this line to make the text more visible
                tickFormatter={(value) => {
                  try {
                    const date = new Date(value);
                    return format(date, 'MMM d, h:mm a');
                  } catch (e) {
                    console.error('Error formatting date:', e);
                    return value;
                  }
                }}
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSeverityColor, getSeverityBg } from "./dashboard/utils/colorUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MLOutlier {
  event_count: number;
  ml_cluster: number;
  rule_level: "low" | "medium" | "high";
  tactics: string;
  techniques: string;
  title: string;
}

const OutliersWidget = () => {
  const { data: outliers, isLoading } = useQuery({
    queryKey: ['ml_outliers_title'],
    queryFn: async () => {
      const response = await fetch('/api/ml_outliers_title');
      if (!response.ok) {
        throw new Error('Failed to fetch ML outliers');
      }
      const data = await response.json();
      return data.ml_outliers_title as MLOutlier[];
    }
  });

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <AlertOctagon className="h-5 w-5 text-purple-500" />
            ML Outliers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-purple-900/20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const trendData = outliers?.map((outlier, index) => ({
    name: `Event ${index + 1}`,
    count: outlier.event_count,
    severity: outlier.rule_level,
    title: outlier.title
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 border border-purple-500/20 p-3 rounded-lg shadow-xl">
          <p className="text-purple-100 font-medium mb-1">{data.title}</p>
          <p className="text-purple-200/80 text-sm">
            {data.count} events
          </p>
          <p className="text-purple-300/60 text-xs mt-1 capitalize">
            Severity: {data.severity}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <AlertOctagon className="h-5 w-5 text-purple-500" />
          ML Outliers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
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
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <ScrollArea className="h-[200px] pr-4">
          <div className="grid gap-3">
            {outliers?.map((outlier, index) => (
              <div
                key={index}
                className={`
                  ${getSeverityBg(outlier.rule_level)} 
                  p-3 rounded-lg border 
                  ${outlier.rule_level === 'high' ? 'border-red-500/30' : 
                    outlier.rule_level === 'medium' ? 'border-yellow-500/30' : 
                    'border-green-500/30'}
                  transition-all duration-300 ease-in-out
                  hover:transform hover:-translate-y-0.5
                  cursor-pointer
                  backdrop-blur-sm
                `}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="text-gray-200 text-sm font-medium truncate flex-1" 
                    title={outlier.title}
                  >
                    {outlier.title}
                  </span>
                  <span 
                    className={`
                      ${getSeverityColor(outlier.rule_level)} 
                      font-bold ml-4 px-2 py-1 rounded-full 
                      bg-black/20 text-xs
                    `}
                  >
                    {outlier.event_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default OutliersWidget;
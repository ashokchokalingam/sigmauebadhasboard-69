import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSeverityColor, getSeverityBg } from "./dashboard/utils/colorUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <AlertOctagon className="h-5 w-5 text-purple-500" />
          ML Outliers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-3">
            {outliers?.map((outlier, index) => (
              <div
                key={index}
                className={`${getSeverityBg(outlier.rule_level)} p-3 rounded-lg border border-${outlier.rule_level === 'high' ? '[#FF0000]' : outlier.rule_level === 'medium' ? '[#FFFF00]' : '[#008000]'}/30`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200 text-sm truncate flex-1" title={outlier.title}>
                      {outlier.title}
                    </span>
                    <span className={`${getSeverityColor(outlier.rule_level)} font-bold ml-4`}>
                      {outlier.event_count} events
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span>{outlier.tactics}</span>
                    <span>•</span>
                    <span>{outlier.techniques}</span>
                  </div>
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
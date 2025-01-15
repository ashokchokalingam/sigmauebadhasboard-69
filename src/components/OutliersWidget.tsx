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

  const getBorderColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "border-red-500/30";
      case "medium":
        return "border-yellow-500/30";
      case "low":
        return "border-green-500/30";
      default:
        return "border-blue-500/30";
    }
  };

  const getHoverEffect = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "hover:bg-red-950/20";
      case "medium":
        return "hover:bg-yellow-950/20";
      case "low":
        return "hover:bg-green-950/20";
      default:
        return "hover:bg-blue-950/20";
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
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-3">
            {outliers?.map((outlier, index) => (
              <div
                key={index}
                className={`
                  ${getSeverityBg(outlier.rule_level)} 
                  ${getBorderColor(outlier.rule_level)}
                  ${getHoverEffect(outlier.rule_level)}
                  p-4 rounded-lg border 
                  transition-all duration-300 ease-in-out
                  hover:transform hover:-translate-y-0.5
                  cursor-pointer
                  backdrop-blur-sm
                  shadow-lg
                `}
              >
                <div className="flex flex-col gap-2">
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
                        bg-black/20 text-sm
                      `}
                    >
                      {outlier.event_count}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs text-gray-400/80">
                    <span className="bg-black/30 px-2 py-0.5 rounded">
                      {outlier.tactics}
                    </span>
                    <span>•</span>
                    <span className="font-mono bg-black/30 px-2 py-0.5 rounded">
                      {outlier.techniques}
                    </span>
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
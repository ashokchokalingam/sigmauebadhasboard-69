import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Outlier {
  count: number;
  severity: "high" | "medium" | "low";
  type: string;
}

const OutliersWidget = () => {
  const { data: outliers } = useQuery({
    queryKey: ['outliers'],
    queryFn: async () => {
      // Simulated data - replace with actual API endpoint when available
      return [
        { count: 15, severity: "high", type: "Authentication" },
        { count: 8, severity: "high", type: "Data Access" },
        { count: 12, severity: "medium", type: "Network" }
      ] as Outlier[];
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-[#FF0000]"; // Critical Red
      case "medium": return "text-[#FFA500]"; // Orange
      default: return "text-[#008000]"; // Green
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high": return "bg-[#FF0000]/20"; // Critical Red background
      case "medium": return "bg-[#FFA500]/20"; // Orange background
      default: return "bg-[#008000]/20"; // Green background
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
        <div className="grid gap-3">
          {outliers?.map((outlier, index) => (
            <div
              key={index}
              className={`${getSeverityBg(outlier.severity)} p-3 rounded-lg border border-${outlier.severity === 'high' ? '[#FF0000]' : '[#FFA500]'}/30`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-200">{outlier.type}</span>
                <span className={`${getSeverityColor(outlier.severity)} font-bold`}>
                  {outlier.count} anomalies
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
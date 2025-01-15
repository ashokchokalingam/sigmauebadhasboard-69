import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSeverityColor, getSeverityBg } from "./dashboard/utils/colorUtils";

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
              className={`${getSeverityBg(outlier.severity)} p-3 rounded-lg border border-${outlier.severity === 'high' ? '[#FFA500]' : '[#FFFF00]'}/30`}
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
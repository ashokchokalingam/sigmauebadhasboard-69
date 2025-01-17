import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface RiskyAsset {
  id: string;
  name: string;
  riskScore: number;
  trend: "up" | "down" | "stable";
  type: "server" | "database" | "application";
}

const HighRiskAssetsWidget = () => {
  const { data: riskyAssets } = useQuery({
    queryKey: ['riskyAssets'],
    queryFn: async () => {
      // Simulated data - replace with actual API endpoint when available
      return [
        { id: "1", name: "prod-db-01", riskScore: 9.2, trend: "up", type: "database" },
        { id: "2", name: "auth-server", riskScore: 8.9, trend: "stable", type: "server" },
        { id: "3", name: "payment-api", riskScore: 8.6, trend: "down", type: "application" },
        { id: "4", name: "user-db", riskScore: 9.1, trend: "up", type: "database" }
      ] as RiskyAsset[];
    }
  });

  const getTrendLine = (trend: string) => {
    switch (trend) {
      case "up": return "M1 9L5 5L9 9";
      case "down": return "M1 5L5 9L9 5";
      default: return "M1 7H9";
    }
  };

  const getTrendColor = (score: number) => {
    if (score >= 9) return "text-red-500";
    if (score >= 8) return "text-orange-500";
    return "text-yellow-500";
  };

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <AlertTriangle className="h-5 w-5 text-purple-500" />
          High Risk Assets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {riskyAssets?.map((asset) => (
            <div
              key={asset.id}
              className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/30 hover:bg-purple-950/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                    <Database className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-200 group-hover:text-gray-100 transition-colors">
                    {asset.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    width="40"
                    height="14"
                    viewBox="0 0 40 14"
                    className={`${getTrendColor(asset.riskScore)} opacity-60`}
                  >
                    <path
                      d={getTrendLine(asset.trend)}
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  <span className={`font-mono font-bold ${getTrendColor(asset.riskScore)}`}>
                    {asset.riskScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HighRiskAssetsWidget;
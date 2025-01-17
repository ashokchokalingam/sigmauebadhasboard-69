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
    <div className="spotify-card">
      <div className="spotify-header">
        <h2 className="flex items-center gap-2 text-purple-100 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-purple-500" />
          High Risk Assets
        </h2>
      </div>
      <div className="spotify-content">
        {riskyAssets?.map((asset) => (
          <div key={asset.id} className="spotify-item">
            <div className="spotify-item-left">
              <div className="spotify-item-icon">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <div className="spotify-item-text">
                <div className="spotify-item-title">{asset.name}</div>
                <div className="spotify-item-subtitle">Type: {asset.type}</div>
              </div>
            </div>
            <div className="spotify-item-right">
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
        ))}
      </div>
    </div>
  );
};

export default HighRiskAssetsWidget;
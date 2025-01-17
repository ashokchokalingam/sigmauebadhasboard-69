import { Database, AlertTriangle, Search, Server, Code } from "lucide-react";
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
      // Simulated data - replace with actual API endpoint
      return [
        { id: "1", name: "prod-db-01", riskScore: 9.2, trend: "up", type: "database" },
        { id: "2", name: "auth-server", riskScore: 8.9, trend: "stable", type: "server" },
        { id: "3", name: "payment-api", riskScore: 8.6, trend: "down", type: "application" },
        { id: "4", name: "user-db", riskScore: 9.1, trend: "up", type: "database" }
      ] as RiskyAsset[];
    }
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "database":
        return <Database className="h-5 w-5 text-blue-400" />;
      case "server":
        return <Server className="h-5 w-5 text-purple-400" />;
      case "application":
        return <Code className="h-5 w-5 text-emerald-400" />;
      default:
        return <Database className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <div className="widget-container">
      <div className="widget-header">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            High Risk Assets
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400">
          {riskyAssets?.length || 0} critical assets
        </span>
      </div>

      <div className="widget-search">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400/50" />
          <input
            type="text"
            placeholder="Search critical assets..."
            className="widget-search-input"
          />
        </div>
      </div>

      <div className="widget-content">
        {riskyAssets?.map((asset) => (
          <div key={asset.id} className="widget-item">
            <div className="widget-item-left">
              <div className="widget-item-icon">
                {getAssetIcon(asset.type)}
              </div>
              <div className="widget-item-text">
                <h3 className="widget-item-title">
                  {asset.name}
                </h3>
                <p className="widget-item-subtitle">
                  Type: {asset.type}
                </p>
              </div>
            </div>

            <div className="widget-item-right">
              <div className="risk-score-container">
                <div className="risk-level">
                  <span className="risk-level-text text-red-400 animate-pulse">
                    Risk Level
                  </span>
                  <span className="risk-level-value text-red-400/70">
                    Critical
                  </span>
                </div>
                <div className="cardiogram">
                  <svg viewBox="0 0 600 100" preserveAspectRatio="none">
                    <path
                      d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                      className="stroke-red-500 fill-none stroke-[3]"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="risk-score text-red-400">
                  {asset.riskScore}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighRiskAssetsWidget;
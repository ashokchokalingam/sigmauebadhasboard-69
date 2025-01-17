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

  return (
    <div className="entity-card">
      <div className="entity-header">
        <div className="entity-title">
          <AlertTriangle className="h-5 w-5 text-purple-500" />
          High Risk Assets
          <span className="entity-count">{riskyAssets?.length || 0} risky assets</span>
        </div>
      </div>

      <div className="entity-search">
        <input
          type="text"
          placeholder="Search entities..."
          className="entity-search-input"
        />
      </div>

      <div className="entity-content scrollbar-thin">
        {riskyAssets?.map((asset) => (
          <div key={asset.id} className="entity-item">
            <div className="entity-item-left">
              <div className="entity-item-icon">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <div className="entity-item-text">
                <div className="entity-item-title">{asset.name}</div>
                <div className="entity-item-subtitle">Type: {asset.type}</div>
              </div>
            </div>
            <div className="entity-item-right">
              <div className="risk-score-container">
                <div className="risk-level">
                  <span className="risk-level-text">Risk</span>
                  <span className="risk-level-value">critical</span>
                </div>
                <div className="cardiogram">
                  <svg viewBox="0 0 600 100" preserveAspectRatio="none">
                    <path
                      d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                      className="stroke-current fill-none stroke-[4]"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="risk-score">{asset.riskScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighRiskAssetsWidget;
import { User, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface RiskyUser {
  id: string;
  name: string;
  riskScore: number;
  trend: "up" | "down" | "stable";
  avatar?: string;
}

const HighRiskUsersImpactedWidget = () => {
  const { data: riskyUsers } = useQuery({
    queryKey: ['riskyUsersImpacted'],
    queryFn: async () => {
      // Simulated data - replace with actual API endpoint when available
      return [
        { id: "1", name: "ashok.chokalingam", riskScore: 9.4, trend: "up" },
        { id: "2", name: "zavely", riskScore: 8.9, trend: "stable" },
        { id: "3", name: "zaynah", riskScore: 8.6, trend: "down" },
        { id: "4", name: "zaynes", riskScore: 9.1, trend: "up" }
      ] as RiskyUser[];
    }
  });

  const getRiskClass = (score: number) => {
    if (score >= 9) return "critical-value";
    if (score >= 8) return "medium-value";
    return "low-value";
  };

  return (
    <div className="entity-card">
      <div className="entity-header">
        <div className="entity-title">
          <AlertTriangle className="h-5 w-5 text-[#5856D6]" />
          High Risk Users Impacted
          <span className="entity-count">{riskyUsers?.length || 0} risky users</span>
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
        {riskyUsers?.map((user) => (
          <div key={user.id} className="entity-item">
            <div className="entity-item-left">
              <div className="entity-item-icon">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-[#5856D6]" />
                )}
              </div>
              <div className="entity-item-text">
                <div className="entity-item-title">{user.name}</div>
                <div className="entity-item-subtitle">Risk Level: High</div>
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
                      className={`stroke-current fill-none stroke-[4] ${getRiskClass(user.riskScore)}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className={`risk-score ${getRiskClass(user.riskScore)}`}>
                  {user.riskScore}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighRiskUsersImpactedWidget;
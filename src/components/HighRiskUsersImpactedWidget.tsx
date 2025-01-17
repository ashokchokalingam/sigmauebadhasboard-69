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
          High Risk Users Impacted
        </h2>
      </div>
      <div className="spotify-content">
        {riskyUsers?.map((user) => (
          <div key={user.id} className="spotify-item">
            <div className="spotify-item-left">
              <div className="spotify-item-icon">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div className="spotify-item-text">
                <div className="spotify-item-title">{user.name}</div>
                <div className="spotify-item-subtitle">Risk Level: High</div>
              </div>
            </div>
            <div className="spotify-item-right">
              <svg
                width="40"
                height="14"
                viewBox="0 0 40 14"
                className={`${getTrendColor(user.riskScore)} opacity-60`}
              >
                <path
                  d={getTrendLine(user.trend)}
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span className={`font-mono font-bold ${getTrendColor(user.riskScore)}`}>
                {user.riskScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighRiskUsersImpactedWidget;
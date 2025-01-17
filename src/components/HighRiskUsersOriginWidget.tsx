import { AlertTriangle, Search, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface RiskyUser {
  user: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
}

interface MetricDisplay {
  label: string;
  value: string | number;
}

const HighRiskUsersOriginWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: riskyUsers, isError, isLoading } = useQuery({
    queryKey: ['riskyUsersOrigin'],
    queryFn: async () => {
      const response = await fetch('/api/user_origin_outlier_highrisk');
      if (!response.ok) {
        throw new Error('Failed to fetch high risk users');
      }
      const data = await response.json();
      const sortedUsers = data.user_origin_outlier_highrisk_logs.sort((a: RiskyUser, b: RiskyUser) => 
        parseInt(b.cumulative_risk_score) - parseInt(a.cumulative_risk_score)
      );
      return sortedUsers || [];
    }
  });

  const filteredUsers = riskyUsers?.filter(user => 
    user.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MetricCycler = ({ metrics }: { metrics: MetricDisplay[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % metrics.length);
      }, 3000);
  
      return () => clearInterval(timer);
    }, [metrics.length]);
  
    return (
      <div className="entity-item-subtitle">
        {metrics[currentIndex].label}: {metrics[currentIndex].value}
      </div>
    );
  };

  const getRiskColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 200) return "risk-score-high";
    if (numScore >= 100) return "risk-score-medium";
    return "risk-score-low";
  };

  if (isLoading) {
    return (
      <div className="entity-card">
        <div className="entity-header">
          <h2 className="entity-title">
            <AlertTriangle className="h-5 w-5 text-purple-500" />
            High Risk Users Origin
          </h2>
        </div>
        <div className="entity-content flex items-center justify-center">
          <div className="animate-pulse text-purple-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="entity-card">
        <div className="entity-header">
          <h2 className="entity-title">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            High Risk Users Origin
          </h2>
        </div>
        <div className="entity-content">
          <div className="text-red-400">Failed to load high risk users</div>
        </div>
      </div>
    );
  }

  return (
    <div className="entity-card">
      <div className="entity-header">
        <h2 className="entity-title">
          <AlertTriangle className="h-5 w-5 text-purple-500" />
          High Risk Users Origin
          <span className="entity-count">
            {filteredUsers?.length || 0} risky users
          </span>
        </h2>
      </div>
      <div className="entity-search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entities..."
            className="entity-search-input pl-10"
          />
        </div>
      </div>
      <div className="entity-content">
        {filteredUsers?.map((user: RiskyUser) => {
          const metrics: MetricDisplay[] = [
            { label: "Unique Anomalies", value: user.unique_title_count },
            { label: "Unique Tactics", value: user.unique_tactics_count },
            { label: "Unique Outliers", value: user.unique_outliers }
          ];

          const riskColorClass = getRiskColor(user.cumulative_risk_score);

          return (
            <div key={user.user} className="entity-item">
              <div className="entity-item-left">
                <div className="entity-item-icon">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div className="entity-item-text">
                  <div className="entity-item-title">{user.user}</div>
                  <MetricCycler metrics={metrics} />
                </div>
              </div>
              <div className="entity-item-right">
                <div className="cardiogram">
                  <svg viewBox="0 0 600 100" preserveAspectRatio="none">
                    <path
                      d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                      className={`stroke-current fill-none stroke-[4] ${riskColorClass}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className={`risk-score ${riskColorClass}`}>
                  {user.cumulative_risk_score}
                </span>
              </div>
            </div>
          );
        })}
        {(!filteredUsers || filteredUsers.length === 0) && (
          <div className="text-purple-400/60 text-center py-4">
            No high risk users found
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskUsersOriginWidget;
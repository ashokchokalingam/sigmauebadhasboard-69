import { AlertTriangle, User } from "lucide-react";
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

  const MetricCycler = ({ metrics }: { metrics: MetricDisplay[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % metrics.length);
      }, 3000);
  
      return () => clearInterval(timer);
    }, [metrics.length]);
  
    return (
      <div className="spotify-item-subtitle">
        {metrics[currentIndex].label}: {metrics[currentIndex].value}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="spotify-card">
        <div className="spotify-header">
          <h2 className="flex items-center gap-2 text-purple-100 text-lg font-semibold">
            <AlertTriangle className="h-5 w-5 text-purple-500" />
            High Risk Users Origin
          </h2>
        </div>
        <div className="spotify-content flex items-center justify-center">
          <div className="animate-pulse text-purple-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="spotify-card">
        <div className="spotify-header">
          <h2 className="flex items-center gap-2 text-purple-100 text-lg font-semibold">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            High Risk Users Origin
          </h2>
        </div>
        <div className="spotify-content">
          <div className="text-red-400">Failed to load high risk users</div>
        </div>
      </div>
    );
  }

  return (
    <div className="spotify-card">
      <div className="spotify-header">
        <h2 className="flex items-center gap-2 text-purple-100 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-purple-500" />
          High Risk Users Origin
        </h2>
      </div>
      <div className="spotify-content">
        {(riskyUsers || []).map((user: RiskyUser) => {
          const metrics: MetricDisplay[] = [
            { label: "Unique Anomalies", value: user.unique_title_count },
            { label: "Unique Tactics", value: user.unique_tactics_count },
            { label: "Unique Outliers", value: user.unique_outliers }
          ];

          return (
            <div key={user.user} className="spotify-item">
              <div className="spotify-item-left">
                <div className="spotify-item-icon">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div className="spotify-item-text">
                  <div className="spotify-item-title">{user.user}</div>
                  <MetricCycler metrics={metrics} />
                </div>
              </div>
              <div className="spotify-item-right">
                <span className="font-mono font-bold text-2xl text-red-500">
                  {user.cumulative_risk_score}
                </span>
              </div>
            </div>
          );
        })}
        {(!riskyUsers || riskyUsers.length === 0) && (
          <div className="text-gray-400 text-center py-4">
            No high risk users found
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskUsersOriginWidget;
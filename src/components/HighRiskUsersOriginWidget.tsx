import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, AlertTriangle } from "lucide-react";
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
      }, 3000); // Change every 3 seconds
  
      return () => clearInterval(timer);
    }, [metrics.length]);
  
    return (
      <div className="text-sm text-purple-300/80 animate-fade-in">
        {metrics[currentIndex].label}: {metrics[currentIndex].value}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <AlertTriangle className="h-5 w-5 text-purple-500" />
            High Risk Users Origin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse text-purple-400">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-black/40 border-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            High Risk Users Origin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400">Failed to load high risk users</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <AlertTriangle className="h-5 w-5 text-purple-500" />
          High Risk Users Origin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {(riskyUsers || []).map((user: RiskyUser) => {
            const metrics: MetricDisplay[] = [
              { label: "Unique Anomalies", value: user.unique_title_count },
              { label: "Unique Tactics", value: user.unique_tactics_count },
              { label: "Unique Outliers", value: user.unique_outliers }
            ];

            return (
              <div
                key={user.user}
                className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/30 hover:bg-purple-950/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-200 group-hover:text-gray-100 transition-colors">
                        {user.user}
                      </span>
                      <MetricCycler metrics={metrics} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-2xl text-red-500">
                      {user.cumulative_risk_score}
                    </span>
                  </div>
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
      </CardContent>
    </Card>
  );
};

export default HighRiskUsersOriginWidget;
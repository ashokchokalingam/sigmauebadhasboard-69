import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface RiskyUser {
  user: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
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
      console.log('API Response:', data);
      return data.user_origin_outlier_highrisk_logs || [];
    }
  });

  const getTrendColor = (score: number) => {
    if (score >= 200) return "text-red-500";
    if (score >= 100) return "text-orange-500";
    return "text-yellow-500";
  };

  // Calculate cumulative stats
  const totalHighRiskUsers = (riskyUsers || []).length;
  const criticalRiskUsers = (riskyUsers || []).filter(user => parseInt(user.cumulative_risk_score) >= 200).length;
  const highRiskUsers = (riskyUsers || []).filter(user => parseInt(user.cumulative_risk_score) >= 100 && parseInt(user.cumulative_risk_score) < 200).length;

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
          {(riskyUsers || []).map((user) => (
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
                    <span className="text-sm text-gray-400">
                      {user.unique_outliers} unique anomalies
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${getTrendColor(parseInt(user.cumulative_risk_score))}`}>
                    {user.cumulative_risk_score}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {(riskyUsers?.length === 0) && (
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
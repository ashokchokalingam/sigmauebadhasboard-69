import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, AlertTriangle, Activity, Target, FileBarChart } from "lucide-react";
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
      const sortedUsers = data.user_origin_outlier_highrisk_logs.sort((a: RiskyUser, b: RiskyUser) => 
        parseInt(b.cumulative_risk_score) - parseInt(a.cumulative_risk_score)
      );
      return sortedUsers || [];
    }
  });

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
        <div className="grid gap-4">
          {(riskyUsers || []).map((user: RiskyUser) => (
            <div
              key={user.user}
              className="bg-purple-950/20 p-4 rounded-lg border border-purple-900/30 hover:bg-purple-950/30 transition-all duration-300 group"
            >
              <div className="flex flex-col space-y-4">
                {/* User Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-lg font-medium text-gray-200 group-hover:text-gray-100 transition-colors">
                      {user.user}
                    </span>
                  </div>
                  <div className="text-[#ea384c] text-3xl font-bold font-mono animate-pulse">
                    {user.cumulative_risk_score}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Unique Anomalies */}
                  <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-200">Unique Anomalies</span>
                    </div>
                    <div className="text-xl font-semibold text-purple-100">
                      {parseInt(user.unique_tactics_count) + user.unique_title_count}
                    </div>
                  </div>

                  {/* Unique Outliers */}
                  <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-200">Unique Outliers</span>
                    </div>
                    <div className="text-xl font-semibold text-purple-100">
                      {user.unique_outliers}
                    </div>
                  </div>
                </div>

                {/* Risk Score Progress */}
                <div className="w-full bg-purple-900/20 rounded-full h-2">
                  <div 
                    className="bg-[#ea384c] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((parseInt(user.cumulative_risk_score) / 300) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
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
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
        <div className="grid gap-6">
          {(riskyUsers || []).map((user: RiskyUser) => (
            <div
              key={user.user}
              className="relative overflow-hidden bg-gradient-to-br from-purple-950/30 to-purple-900/10 rounded-xl border border-purple-900/30 p-6 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-500 group"
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-purple-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* User Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-700/20 flex items-center justify-center border border-purple-500/20 shadow-lg">
                    <User className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-100 group-hover:text-white transition-colors">
                      {user.user}
                    </h3>
                    <p className="text-purple-300/60 text-sm">High Risk User</p>
                  </div>
                </div>
                <div className="text-[#ea384c] text-5xl font-bold font-mono tracking-tight group-hover:scale-110 transition-transform duration-300">
                  {user.cumulative_risk_score}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Combined Anomalies Card */}
                <div className="bg-purple-950/30 rounded-lg p-4 border border-purple-800/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-200 font-medium">Total Anomalies</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-purple-100">
                      {parseInt(user.unique_tactics_count) + user.unique_title_count}
                    </span>
                    <span className="text-purple-400/60 text-sm mb-1">detected</span>
                  </div>
                  <div className="mt-2 text-xs text-purple-300/60">
                    Tactics: {user.unique_tactics_count} | Titles: {user.unique_title_count}
                  </div>
                </div>

                {/* Outliers Card */}
                <div className="bg-purple-950/30 rounded-lg p-4 border border-purple-800/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-200 font-medium">Unique Outliers</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-purple-100">
                      {user.unique_outliers}
                    </span>
                    <span className="text-purple-400/60 text-sm mb-1">detected</span>
                  </div>
                  <div className="mt-2 text-xs text-purple-300/60">
                    Behavioral anomalies detected
                  </div>
                </div>
              </div>

              {/* Risk Score Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-purple-300">Risk Level</span>
                  <span className="text-sm text-[#ea384c] font-semibold">
                    {Math.min((parseInt(user.cumulative_risk_score) / 300) * 100, 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-purple-950/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-[#ea384c] transition-all duration-500"
                    style={{ 
                      width: `${Math.min((parseInt(user.cumulative_risk_score) / 300) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          {(!riskyUsers || riskyUsers.length === 0) && (
            <div className="text-purple-300 text-center py-8">
              No high risk users found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HighRiskUsersOriginWidget;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, AlertTriangle, Activity } from "lucide-react";
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

  const getRiskLevel = (score: number) => {
    if (score >= 200) return 'critical';
    if (score >= 100) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
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
    <Card className="bg-black/40 border-purple-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <AlertTriangle className="h-5 w-5 text-purple-500" />
          High Risk Users Origin
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-3 pb-6">
            {(riskyUsers || []).map((user: RiskyUser) => {
              const riskLevel = getRiskLevel(parseInt(user.cumulative_risk_score));
              const totalAnomalies = parseInt(user.unique_tactics_count) + user.unique_title_count;
              
              return (
                <div
                  key={user.user}
                  className="relative group rounded-lg bg-purple-950/30 hover:bg-purple-900/20 transition-all duration-300"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-purple-100">
                            {user.user}
                          </h3>
                          <p className="text-xs text-purple-400/60">
                            {totalAnomalies} unique anomalies
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-purple-400/60">Risk</div>
                        <div className={`text-2xl font-bold ${getRiskColor(riskLevel)}`}>
                          {user.cumulative_risk_score}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-purple-950/30 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-medium text-purple-300">Total Anomalies</span>
                        </div>
                        <div className="text-lg font-semibold text-purple-100">
                          {totalAnomalies}
                        </div>
                        <div className="text-xs text-purple-400/60 mt-1">
                          Tactics: {user.unique_tactics_count} | Titles: {user.unique_title_count}
                        </div>
                      </div>

                      <div className="bg-purple-950/30 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-medium text-purple-300">Unique Outliers</span>
                        </div>
                        <div className="text-lg font-semibold text-purple-100">
                          {user.unique_outliers}
                        </div>
                        <div className="text-xs text-purple-400/60 mt-1">
                          Behavioral anomalies
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="h-1 w-full bg-purple-950/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
                          style={{ 
                            width: `${Math.min((parseInt(user.cumulative_risk_score) / 300) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!riskyUsers || riskyUsers.length === 0) && (
              <div className="text-purple-300 text-center py-8">
                No high risk users found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HighRiskUsersOriginWidget;
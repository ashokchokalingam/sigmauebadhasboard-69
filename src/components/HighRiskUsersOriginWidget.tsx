import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, AlertTriangle, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface RiskyUser {
  id: string;
  name: string;
  riskScore: number;
  trend: "up" | "down" | "stable";
  avatar?: string;
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
      console.log('API Response:', data); // Debug log
      // Ensure we're returning an array
      return Array.isArray(data) ? data : [];
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

  // Calculate cumulative stats
  const totalHighRiskUsers = (riskyUsers || []).length;
  const criticalRiskUsers = (riskyUsers || []).filter(user => user.riskScore >= 9).length;
  const highRiskUsers = (riskyUsers || []).filter(user => user.riskScore >= 8 && user.riskScore < 9).length;

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
        <div className="mb-4 grid grid-cols-3 gap-2 bg-purple-950/20 p-3 rounded-lg border border-purple-900/30">
          <div className="text-center">
            <div className="text-sm text-purple-300">Total High Risk</div>
            <div className="text-2xl font-bold text-purple-100">{totalHighRiskUsers}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-red-300">Critical Risk</div>
            <div className="text-2xl font-bold text-red-500">{criticalRiskUsers}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-orange-300">High Risk</div>
            <div className="text-2xl font-bold text-orange-500">{highRiskUsers}</div>
          </div>
        </div>
        <div className="grid gap-3">
          {(riskyUsers || []).map((user) => (
            <div
              key={user.id}
              className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/30 hover:bg-purple-950/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <span className="text-gray-200 group-hover:text-gray-100 transition-colors">
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
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
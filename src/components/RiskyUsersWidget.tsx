import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2, Skull, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskyUser {
  user_id: string;
  risk_score: number;
}

interface ApiResponse {
  risky_users: RiskyUser[];
}

const RiskyUsersWidget = () => {
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['risky-users'],
    queryFn: async () => {
      const response = await fetch('http://172.16.0.75:5001/api/risky_users');
      if (!response.ok) {
        throw new Error('Failed to fetch risky users');
      }
      const jsonData = await response.json();
      // Ensure the response has the expected structure
      if (!jsonData || !Array.isArray(jsonData.risky_users)) {
        throw new Error('Invalid response format');
      }
      return jsonData;
    },
    retry: 2,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-500";
    if (score >= 50) return "text-orange-500";
    return "text-yellow-400";
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return "bg-red-950/20";
    if (score >= 50) return "bg-orange-950/20";
    return "bg-yellow-950/20";
  };

  const getRiskBorderColor = (score: number) => {
    if (score >= 80) return "border-red-900/30";
    if (score >= 50) return "border-orange-900/30";
    return "border-yellow-900/30";
  };

  if (error) {
    return (
      <Card className="bg-black/40 border-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-100">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Error Loading Risk Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Failed to load risky users data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-100">
          <Skull className="h-5 w-5 text-red-500" />
          High Risk Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        ) : (
          <div className="grid gap-4">
            {data?.risky_users && data.risky_users.length > 0 ? (
              data.risky_users
                .sort((a, b) => b.risk_score - a.risk_score)
                .map((user, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]",
                      getRiskBgColor(user.risk_score),
                      getRiskBorderColor(user.risk_score)
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-gray-200">{user.user_id || 'Unknown User'}</span>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded text-sm font-bold",
                        getRiskColor(user.risk_score)
                      )}>
                        {user.risk_score}% Risk
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-gray-400 py-4">No high-risk users detected</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskyUsersWidget;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface RiskyUser {
  id: string;
  name: string;
  riskScore: number;
  trend: "up" | "down" | "stable";
  avatar?: string;
}

interface RiskyUsersWidgetProps {
  onEntitySelect?: (entity: { type: "userorigin" | "userimpacted"; id: string } | null) => void;
}

const RiskyUsersWidget = ({ onEntitySelect }: RiskyUsersWidgetProps) => {
  const { data: riskyUsers } = useQuery({
    queryKey: ['riskyUsers'],
    queryFn: async () => {
      const response = await fetch('/api/user_origin');
      if (!response.ok) {
        throw new Error('Failed to fetch risky users');
      }
      const data = await response.json();
      
      // Transform API data to match our interface
      return data.user_origin.map((user: any) => ({
        id: user.user_origin,
        name: user.user_origin,
        riskScore: parseFloat(user.total_unique_risk_score) || 0,
        trend: user.trend || "stable",
        uniqueTitles: user.unique_titles
      })).slice(0, 4); // Get top 4 risky users
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

  const handleUserClick = (user: RiskyUser, type: "userorigin" | "userimpacted") => {
    if (onEntitySelect) {
      onEntitySelect({ type, id: user.name });
    }
  };

  return (
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <AlertTriangle className="h-5 w-5 text-purple-500" />
          High Risk Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {riskyUsers?.map((user) => (
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
                  <div className="space-y-1">
                    <span className="text-gray-200 group-hover:text-gray-100 transition-colors">
                      {user.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUserClick(user, "userorigin")}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        View as Origin
                      </button>
                      <button
                        onClick={() => handleUserClick(user, "userimpacted")}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        View as Impacted
                      </button>
                    </div>
                  </div>
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
                    {user.riskScore.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskyUsersWidget;
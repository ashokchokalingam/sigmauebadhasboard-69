import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TimelineView from "./dashboard/TimelineView";
import { useState } from "react";

interface RiskyUser {
  id: string;
  name: string;
  riskScore: number;
  trend: "up" | "down" | "stable";
  avatar?: string;
}

const RiskyUsersWidget = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { data: riskyUsers } = useQuery({
    queryKey: ['riskyUsers'],
    queryFn: async () => {
      // Simulated data - replace with actual API endpoint when available
      return [
        { id: "1", name: "Sarah Chen", riskScore: 9.5, trend: "up" },
        { id: "2", name: "Mike Johnson", riskScore: 8.7, trend: "stable" },
        { id: "3", name: "Emma Davis", riskScore: 8.4, trend: "down" },
        { id: "4", name: "Alex Wong", riskScore: 9.3, trend: "up" }
      ] as RiskyUser[];
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

  const handleUserClick = (user: RiskyUser) => {
    setSelectedUser(user.name);
  };

  if (selectedUser) {
    return (
      <TimelineView
        entityType="userorigin"
        entityId={selectedUser}
        onClose={() => setSelectedUser(null)}
        inSidebar={false}
      />
    );
  }

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
              className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/30 hover:bg-purple-950/30 transition-all duration-300 group cursor-pointer"
              onClick={() => handleUserClick(user)}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskyUsersWidget;
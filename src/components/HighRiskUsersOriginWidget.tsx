import { AlertTriangle, Search, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface RiskyUser {
  user: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
}

const HighRiskUsersOriginWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredUsers = riskyUsers?.filter(user => 
    user.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskLevel = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 200) return "critical";
    if (numScore >= 100) return "high";
    return "low";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-500";
      case "high": return "text-orange-500";
      default: return "text-yellow-500";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#1e2c3d]/40 border border-blue-500/10 rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-purple-400/80" />
            <span className="text-lg font-semibold text-blue-100/90">High Risk Users Origin</span>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="animate-pulse text-purple-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1e2c3d]/40 border border-blue-500/10 rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-lg font-semibold text-blue-100/90">High Risk Users Origin</span>
          </div>
        </div>
        <div className="p-4">
          <div className="text-red-400">Failed to load high risk users</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e2c3d]/40 border border-blue-500/10 rounded-xl overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-purple-400/80" />
          <span className="text-lg font-semibold text-blue-100/90">High Risk Users Origin</span>
        </div>
        <span className="text-sm font-medium text-purple-400/80">
          {filteredUsers?.length || 0} risky users
        </span>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entities..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1e2c3d]/40 hover:bg-[#1e2c3d]/60 
              border border-blue-500/5 hover:border-blue-500/10 rounded-lg
              text-sm text-blue-100/90 placeholder:text-blue-400/50
              transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/10 scrollbar-track-transparent">
        {filteredUsers?.map((user: RiskyUser) => {
          const riskLevel = getRiskLevel(user.cumulative_risk_score);
          const riskColor = getRiskColor(riskLevel);
          const isHighRisk = parseInt(user.cumulative_risk_score) >= 200;

          return (
            <div key={user.user} 
              className="group relative flex items-center p-4 rounded-lg h-[72px]
                transition-all duration-300 cursor-pointer
                bg-[#1e2c3d]/40 hover:bg-[#1e2c3d]/60
                border border-blue-500/5 hover:border-blue-500/10">
              <div className="flex items-center w-full">
                <div className="flex items-center gap-4 flex-[0_0_50%]">
                  <div className="relative w-10 h-10 rounded-full bg-blue-950/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400/70" />
                  </div>
                  <div className="flex flex-col min-w-[120px]">
                    <span className="font-mono text-base text-blue-200/90 font-medium group-hover:text-blue-100 truncate max-w-[200px]">
                      {user.user}
                    </span>
                    <span className="text-sm text-[#60A5FA] font-semibold mt-1 drop-shadow-[0_0_3px_rgba(96,165,250,0.3)]">
                      {user.unique_title_count} unique anomalies
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-end">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <span className={`text-base font-medium ${riskColor} ${isHighRisk ? 'animate-pulse' : ''}`}>
                        Risk
                      </span>
                      <span className={`text-xs font-medium -mt-0.5 ${riskColor} ${isHighRisk ? 'animate-pulse' : ''}`}>
                        {riskLevel}
                      </span>
                    </div>
                    <div className="relative w-20 h-6 overflow-hidden">
                      <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
                        <path
                          d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                          className={`stroke-current fill-none stroke-[4] ${riskColor} ${isHighRisk ? 'animate-pulse' : ''}`}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className={`font-bold text-3xl min-w-[70px] text-right ${riskColor} ${isHighRisk ? 'animate-pulse' : ''}`}>
                      {user.cumulative_risk_score}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {(!filteredUsers || filteredUsers.length === 0) && (
          <div className="text-blue-400/60 text-center py-4">
            No high risk users found
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskUsersOriginWidget;
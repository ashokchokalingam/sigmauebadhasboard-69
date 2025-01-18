import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import WidgetHeader from "./widgets/WidgetHeader";
import SearchInput from "./widgets/SearchInput";

interface RiskyUser {
  user: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
}

const HighRiskUsersImpactedWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: riskyUsers, isError, isLoading } = useQuery({
    queryKey: ['riskyUsersImpacted'],
    queryFn: async () => {
      const response = await fetch('/api/user_impacted_outlier_highrisk');
      if (!response.ok) {
        throw new Error('Failed to fetch high risk users');
      }
      const data = await response.json();
      const sortedUsers = data.user_impacted_outlier_highrisk_logs.sort((a: RiskyUser, b: RiskyUser) => 
        parseInt(b.cumulative_risk_score) - parseInt(a.cumulative_risk_score)
      );
      return sortedUsers || [];
    }
  });

  const filteredUsers = riskyUsers?.filter(user => 
    user.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-[#0A0B0F] border border-red-500/10 rounded-xl overflow-hidden shadow-2xl shadow-red-500/10">
        <div className="p-6">
          <div className="animate-pulse text-red-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0A0B0F] border border-red-500/10 rounded-xl overflow-hidden shadow-2xl shadow-red-500/10">
        <div className="p-6">
          <div className="text-red-400">Failed to load high risk users</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0B0F] border border-red-500/10 rounded-xl overflow-hidden shadow-2xl shadow-red-500/10 h-[500px] flex flex-col">
      <WidgetHeader 
        title="High Risk Users Impacted" 
        count={filteredUsers?.length || 0} 
      />

      <div className="p-6">
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="px-6 pb-6 space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-red-500/10 scrollbar-track-transparent">
        {filteredUsers?.map((user: RiskyUser) => (
          <div
            key={user.user}
            className="group relative p-4 rounded-xl
              bg-[#0D0E12] hover:bg-[#12131A]
              border border-red-500/10 hover:border-red-500/20
              transition-all duration-300 cursor-pointer
              shadow-lg shadow-red-500/5 hover:shadow-red-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 group-hover:border-red-500/20 transition-colors">
                  <User className="h-5 w-5 text-red-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-mono text-base text-red-100/90 font-medium group-hover:text-red-100">
                    {user.user}
                  </h3>
                  <p className="text-sm text-red-400/70 font-medium">
                    {user.unique_title_count} unique anomalies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-red-400 animate-pulse">
                    Risk Level
                  </span>
                  <span className="text-xs font-medium text-red-400/70">
                    Critical
                  </span>
                </div>
                <div className="relative w-20 h-6 overflow-hidden opacity-70">
                  <svg className="w-[200%] h-full animate-cardiogram" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <path
                      d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                      className="stroke-red-500 fill-none stroke-[3]"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-mono font-bold text-2xl text-red-400 tabular-nums">
                  {user.cumulative_risk_score}
                </span>
              </div>
            </div>
          </div>
        ))}
        {(!filteredUsers || filteredUsers.length === 0) && (
          <div className="text-center py-8">
            <span className="text-red-400/60">No critical users found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskUsersImpactedWidget;
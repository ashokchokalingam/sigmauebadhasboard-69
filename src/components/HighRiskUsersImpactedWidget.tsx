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
      <div className="bg-[#0A0B0F] border border-red-500/10 rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse text-red-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0A0B0F] border border-red-500/10 rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="text-red-400">Failed to load high risk users</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0B0F] border border-red-500/10 rounded-xl overflow-hidden h-[500px] flex flex-col">
      <WidgetHeader 
        title="High Risk Users Impacted" 
        count={filteredUsers?.length || 0} 
      />

      <div className="p-4">
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="px-4 pb-4 space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-red-500/10 scrollbar-track-transparent">
        {filteredUsers?.map((user: RiskyUser) => (
          <div
            key={user.user}
            className="group p-4 rounded-lg
              bg-[#0D0E12] hover:bg-[#12131A]
              border border-red-500/10 hover:border-red-500/20
              transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-red-400" />
                <div>
                  <h3 className="text-sm font-medium text-red-100/90">
                    {user.user}
                  </h3>
                  <p className="text-xs text-red-400/70">
                    {user.unique_title_count} unique anomalies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-sm font-medium text-red-400">
                    Risk Level
                  </span>
                  <span className="block text-xs text-red-400/70">
                    Critical
                  </span>
                </div>
                <span className="font-mono font-bold text-2xl text-red-400">
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
import { Shield, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import WidgetHeader from "./widgets/WidgetHeader";
import SearchInput from "./widgets/SearchInput";
import { useToast } from "@/components/ui/use-toast";

interface RiskyUser {
  user: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
}

const HighRiskUsersOriginWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

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

  const handleUserClick = async (userId: string) => {
    try {
      const response = await fetch(`/api/user_origin_timeline?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      const data = await response.json();
      console.log('Timeline data for user origin:', data);
      
      toast({
        title: "Timeline Data Retrieved",
        description: `Successfully loaded timeline for ${userId}`,
      });
    } catch (error) {
      console.error('Error fetching timeline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load timeline data",
      });
    }
  };

  const filteredUsers = riskyUsers?.filter(user => 
    user.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-[#0A0B0F] border border-red-500/20 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-red-500/20 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-red-500/20 rounded"></div>
                <div className="h-4 bg-red-500/20 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0A0B0F] border border-red-500/20 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="text-red-400 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            Failed to load high risk users
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0A0B0F] to-[#1A1F2C] border border-red-500/20 rounded-xl overflow-hidden h-[500px] flex flex-col shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-red-500/10">
      <WidgetHeader 
        title="High Risk Users Origin" 
        count={filteredUsers?.length || 0} 
      />

      <div className="p-4 bg-black/20">
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search critical users..."
        />
      </div>

      <div className="px-4 pb-4 space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-red-500/10 scrollbar-track-transparent">
        {filteredUsers?.map((user: RiskyUser) => (
          <div
            key={user.user}
            onClick={() => handleUserClick(user.user)}
            className="group p-4 rounded-lg
              bg-gradient-to-r from-[#0D0E12] to-[#12131A]
              hover:from-[#12131A] hover:to-[#1A1F2C]
              border border-red-500/20 hover:border-red-500/40
              transition-all duration-300 cursor-pointer
              shadow-lg hover:shadow-xl hover:shadow-red-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-red-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <User className="relative h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-100/90 group-hover:text-red-100">
                    {user.user}
                  </h3>
                  <p className="text-xs text-red-400/70 group-hover:text-red-400/90">
                    {user.unique_title_count} unique anomalies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-sm font-medium text-red-400 group-hover:text-red-300">
                    Risk Level
                  </span>
                  <span className="block text-xs text-red-400/70 group-hover:text-red-400">
                    Critical
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-red-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <span className="relative font-mono font-bold text-2xl text-red-400 group-hover:text-red-300">
                    {user.cumulative_risk_score}
                  </span>
                </div>
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

export default HighRiskUsersOriginWidget;
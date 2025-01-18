import { AlertTriangle, Search, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface RiskyAsset {
  computer_name: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
}

const HighRiskAssetsWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: riskyAssets, isError, isLoading } = useQuery({
    queryKey: ['riskyAssets'],
    queryFn: async () => {
      const response = await fetch('/api/computer_impacted_outlier_highrisk');
      if (!response.ok) {
        throw new Error('Failed to fetch high risk assets');
      }
      const data = await response.json();
      const sortedAssets = data.computer_impacted_outlier_highrisk_logs.sort((a: RiskyAsset, b: RiskyAsset) => 
        parseInt(b.cumulative_risk_score) - parseInt(a.cumulative_risk_score)
      );
      return sortedAssets || [];
    }
  });

  const filteredAssets = riskyAssets?.filter(asset => 
    asset.computer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-[#0A0B0F] border border-indigo-500/10 rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/10">
        <div className="p-6">
          <div className="animate-pulse text-indigo-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0A0B0F] border border-indigo-500/10 rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/10">
        <div className="p-6">
          <div className="text-red-400">Failed to load high risk assets</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0B0F] border border-indigo-500/10 rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/10 h-[675px] flex flex-col">
      <div className="p-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-b border-indigo-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              High Risk Assets
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400">
            {filteredAssets?.length || 0} critical assets
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search critical assets..."
            className="w-full pl-11 pr-4 py-3 bg-[#0D0E12] rounded-xl
              border border-indigo-500/10 hover:border-indigo-500/20 
              text-sm text-indigo-100/90 placeholder:text-indigo-400/30
              transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/20
              shadow-inner shadow-indigo-500/5"
          />
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/10 scrollbar-track-transparent">
        {filteredAssets?.map((asset: RiskyAsset) => (
          <div
            key={asset.computer_name}
            className="group relative p-4 rounded-xl
              bg-gradient-to-r from-[#0D0E12] to-[#0D0E12]/80
              border border-indigo-500/10 hover:border-indigo-500/20
              transition-all duration-300 cursor-pointer
              hover:shadow-lg hover:shadow-indigo-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                  <User className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-mono text-base text-indigo-100/90 font-medium group-hover:text-indigo-100">
                    {asset.computer_name}
                  </h3>
                  <p className="text-sm text-indigo-400/70 font-medium">
                    {asset.unique_title_count} unique anomalies
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
                  {asset.cumulative_risk_score}
                </span>
              </div>
            </div>
          </div>
        ))}
        {(!filteredAssets || filteredAssets.length === 0) && (
          <div className="text-center py-8">
            <span className="text-indigo-400/60">No critical assets found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskAssetsWidget;
import { Monitor, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import WidgetHeader from "./widgets/WidgetHeader";
import SearchInput from "./widgets/SearchInput";
import { useToast } from "@/hooks/use-toast";
import TimelineView from "./dashboard/TimelineView";

interface RiskyComputer {
  computer: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
}

const HighRiskComputersWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComputer, setSelectedComputer] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: riskyComputers, isError, isLoading } = useQuery({
    queryKey: ['riskyComputers'],
    queryFn: async () => {
      const response = await fetch('/api/computer_impacted_outlier_highrisk');
      if (!response.ok) {
        throw new Error('Failed to fetch high risk computers');
      }
      const data = await response.json();
      const sortedComputers = data.computer_impacted_outlier_highrisk_logs.sort((a: RiskyComputer, b: RiskyComputer) => 
        parseInt(b.cumulative_risk_score) - parseInt(a.cumulative_risk_score)
      );
      return sortedComputers || [];
    }
  });

  const handleComputerClick = async (computer: string) => {
    setSelectedComputer(computer);
  };

  const filteredComputers = riskyComputers?.filter(computer => 
    computer.computer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedComputer) {
    return (
      <TimelineView 
        entityType="computersimpacted"
        entityId={selectedComputer}
        onClose={() => setSelectedComputer(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#0A0B0F] border border-purple-500/20 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-purple-500/20 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-purple-500/20 rounded"></div>
                <div className="h-4 bg-purple-500/20 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0A0B0F] border border-purple-500/20 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="text-purple-400 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            Failed to load high risk computers
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0A0B0F] to-[#1A1F2C] border border-purple-500/20 rounded-xl overflow-hidden h-[500px] flex flex-col shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/10">
      <WidgetHeader 
        title="High Risk Computers" 
        count={filteredComputers?.length || 0} 
      />

      <div className="p-4 bg-black/20">
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search critical computers..."
        />
      </div>

      <div className="px-4 pb-4 space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/10 scrollbar-track-transparent">
        {filteredComputers?.map((computer: RiskyComputer) => (
          <div
            key={computer.computer}
            onClick={() => handleComputerClick(computer.computer)}
            className="group p-4 rounded-lg
              bg-gradient-to-r from-[#0D0E12] to-[#12131A]
              hover:from-[#12131A] hover:to-[#1A1F2C]
              border border-purple-500/20 hover:border-purple-500/40
              transition-all duration-300 cursor-pointer
              shadow-lg hover:shadow-xl hover:shadow-purple-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <Monitor className="relative h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-purple-100/90 group-hover:text-purple-100">
                    {computer.computer}
                  </h3>
                  <p className="text-xs text-purple-400/70 group-hover:text-purple-400/90">
                    {computer.unique_title_count} unique anomalies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-sm font-medium text-purple-400 group-hover:text-purple-300">
                    Risk Level
                  </span>
                  <span className="block text-xs text-purple-400/70 group-hover:text-purple-400">
                    Critical
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <span className="relative font-mono font-bold text-2xl text-purple-400 group-hover:text-purple-300">
                    {computer.cumulative_risk_score}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!filteredComputers || filteredComputers.length === 0) && (
          <div className="text-center py-8">
            <span className="text-purple-400/60">No critical computers found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskComputersWidget;
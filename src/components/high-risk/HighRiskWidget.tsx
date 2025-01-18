import { AlertTriangle, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { HighRiskWidgetProps, RiskyEntity } from "./types";
import EntityCard from "./EntityCard";

const HighRiskWidget = ({ title, entityType, endpoint, dataKey }: HighRiskWidgetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: entities, isError, isLoading } = useQuery({
    queryKey: [dataKey],
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${dataKey}`);
      }
      const data = await response.json();
      const sortedEntities = data[dataKey].sort((a: RiskyEntity, b: RiskyEntity) => 
        parseInt(b.cumulative_risk_score) - parseInt(a.cumulative_risk_score)
      );
      return sortedEntities || [];
    }
  });

  const filteredEntities = entities?.filter((entity: RiskyEntity) => {
    const searchTerm = searchQuery.toLowerCase();
    const entityName = entityType === 'asset' ? entity.computer : entity.user;
    return entityName?.toLowerCase().includes(searchTerm);
  });

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
          <div className="text-red-400">Failed to load {title}</div>
        </div>
      </div>
    );
  }

  const containerHeight = entityType === 'asset' ? 'h-[725px]' : 'h-[675px]';

  return (
    <div className={`bg-[#0A0B0F] border border-indigo-500/10 rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/10 ${containerHeight} flex flex-col`}>
      <div className={`p-6 ${entityType === 'asset' ? 'bg-gradient-to-r from-[#F97316]/10 to-[#8B5CF6]/10 border-b border-indigo-500/20' : 'bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-b border-indigo-500/10'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className={`${entityType === 'asset' ? 'h-6 w-6' : 'h-5 w-5'} text-red-400`} />
            </div>
            <span className={`${entityType === 'asset' ? 'text-xl' : 'text-lg'} font-semibold bg-gradient-to-r ${entityType === 'asset' ? 'from-[#F97316] to-[#8B5CF6]' : 'from-red-400 to-purple-400'} bg-clip-text text-transparent`}>
              {title}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400">
            {filteredEntities?.length || 0} critical {entityType === 'asset' ? 'assets' : 'users'}
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
            placeholder={`Search critical ${entityType === 'asset' ? 'assets' : 'users'}...`}
            className="w-full pl-11 pr-4 py-3.5 bg-[#0D0E12] rounded-xl
              border border-indigo-500/20 hover:border-indigo-500/30 
              text-sm text-indigo-100/90 placeholder:text-indigo-400/30
              transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30
              shadow-inner shadow-indigo-500/10"
          />
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
        {filteredEntities?.map((entity: RiskyEntity) => (
          <EntityCard 
            key={entityType === 'asset' ? entity.computer : entity.user} 
            entity={entity} 
            entityType={entityType}
            showMetricCycle={entityType === 'asset'}
          />
        ))}
        {(!filteredEntities || filteredEntities.length === 0) && (
          <div className="text-center py-8">
            <span className="text-indigo-400/60">No critical {entityType === 'asset' ? 'assets' : 'users'} found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskWidget;
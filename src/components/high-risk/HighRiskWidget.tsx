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
        parseInt(String(b.cumulative_risk_score)) - parseInt(String(a.cumulative_risk_score))
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
      <div className="bg-[#0A0B0F] border border-blue-500/10 rounded-xl overflow-hidden h-[500px]">
        <div className="p-4">
          <div className="animate-pulse text-blue-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0A0B0F] border border-blue-500/10 rounded-xl overflow-hidden h-[500px]">
        <div className="p-4">
          <div className="text-red-400">Failed to load {title}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0B0F] border border-blue-500/10 rounded-xl overflow-hidden h-[500px] flex flex-col">
      <div className="p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-b border-blue-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
            <span className="text-sm font-semibold text-red-400">
              {title}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] font-medium text-red-400">
            {filteredEntities?.length || 0} critical {entityType === 'asset' ? 'assets' : 'users'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search critical ${entityType === 'asset' ? 'assets' : 'users'}...`}
            className="w-full pl-9 pr-3 py-2 bg-[#0D0E12] rounded-lg
              border border-blue-500/20 hover:border-blue-500/30 
              text-xs text-blue-100/90 placeholder:text-blue-400/30
              transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
          />
        </div>
      </div>

      <div className="px-4 pb-4 space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
        {filteredEntities?.map((entity: RiskyEntity) => (
          <EntityCard 
            key={entityType === 'asset' ? entity.computer : entity.user} 
            entity={entity} 
            entityType={entityType}
            showMetricCycle={true}
          />
        ))}
        {(!filteredEntities || filteredEntities.length === 0) && (
          <div className="text-center py-4">
            <span className="text-blue-400/60 text-xs">No critical {entityType === 'asset' ? 'assets' : 'users'} found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskWidget;
import { Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { HighRiskWidgetProps, RiskyEntity } from "./types";
import WidgetHeader from "./WidgetHeader";
import SearchInput from "./SearchInput";
import EntityCard from "./EntityCard";
import TimelineView from "../dashboard/TimelineView";

const HighRiskWidget = ({ entityType, title, apiEndpoint, searchPlaceholder }: HighRiskWidgetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const { data: entities, isError, isLoading } = useQuery({
    queryKey: [apiEndpoint],
    queryFn: async () => {
      const response = await fetch(`/api/${apiEndpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${title}`);
      }
      const data = await response.json();
      const key = Object.keys(data)[0];
      const sortedEntities = data[key].sort((a: RiskyEntity, b: RiskyEntity) => 
        parseInt(b.cumulative_risk_score) - parseInt(a.cumulative_risk_score)
      );
      return sortedEntities || [];
    }
  });

  const handleEntityClick = (entity: RiskyEntity) => {
    const entityId = entityType === 'computer' ? entity.computer : entity.user;
    if (entityId) {
      setSelectedEntity(entityId);
    }
  };

  const filteredEntities = entities?.filter(entity => {
    const searchTerm = searchQuery.toLowerCase();
    const entityName = entityType === 'computer' ? entity.computer : entity.user;
    return entityName?.toLowerCase().includes(searchTerm);
  });

  if (selectedEntity) {
    const timelineEntityType = entityType === 'computer' ? 'computersimpacted' :
                              entityType === 'userOrigin' ? 'userorigin' : 'userimpacted';
    
    return (
      <TimelineView
        entityType={timelineEntityType}
        entityId={selectedEntity}
        onClose={() => setSelectedEntity(null)}
        inSidebar={false}
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
            Failed to load {title}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0A0B0F] to-[#1A1F2C] border border-purple-500/20 rounded-xl overflow-hidden h-[500px] flex flex-col shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/10">
      <WidgetHeader 
        title={title} 
        count={filteredEntities?.length || 0} 
      />

      <div className="p-4 bg-black/20">
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="px-4 pb-4 space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/10 scrollbar-track-transparent">
        {filteredEntities?.map((entity: RiskyEntity) => (
          <EntityCard
            key={entityType === 'computer' ? entity.computer : entity.user}
            entity={entity}
            entityType={entityType}
            onClick={() => handleEntityClick(entity)}
          />
        ))}
        {(!filteredEntities || filteredEntities.length === 0) && (
          <div className="text-center py-8">
            <span className="text-purple-400/60">No critical entities found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskWidget;
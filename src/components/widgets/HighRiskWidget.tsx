
import { Shield, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import EntityCard from "./EntityCard";

interface HighRiskWidgetProps {
  entityType: "userOrigin" | "userImpacted" | "computer";
  title: string;
  apiEndpoint: string;
  searchPlaceholder: string;
}

const HighRiskWidget = ({ entityType, title, apiEndpoint, searchPlaceholder }: HighRiskWidgetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const { data: entities = [] } = useQuery({
    queryKey: [apiEndpoint],
    queryFn: async () => {
      const response = await fetch(`/api/${apiEndpoint}`);
      if (!response.ok) throw new Error(`Failed to fetch ${title}`);
      const data = await response.json();
      const key = Object.keys(data)[0];
      return data[key] || [];
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  const filteredEntities = entities
    .filter((entity: any) => {
      const entityName = entityType === 'computer' ? entity.computer : entity.user;
      return entityName?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a: any, b: any) => parseFloat(b.cumulative_risk_score) - parseFloat(a.cumulative_risk_score));

  const handleEntityClick = (entityId: string) => {
    setSelectedEntityId(currentId => currentId === entityId ? null : entityId);
  };

  return (
    <div className="widget-container">
      <div className="widget-header">
        <div className="widget-title">
          <Shield className="h-5 w-5 text-[#9b87f5]" />
          {title}
        </div>
        <div className="widget-count">
          {filteredEntities.length} active
        </div>
      </div>

      <div className="widget-search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b87f5]/50" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="widget-search-input"
          />
        </div>
      </div>
      
      <div className="widget-content">
        {filteredEntities.map((entity: any) => (
          <EntityCard
            key={entityType === 'computer' ? entity.computer : entity.user}
            entity={entity}
            entityType={entityType}
            onClick={() => handleEntityClick(entityType === 'computer' ? entity.computer : entity.user)}
            isExpanded={selectedEntityId === (entityType === 'computer' ? entity.computer : entity.user)}
          />
        ))}
        {filteredEntities.length === 0 && (
          <div className="text-center text-[#9b87f5]/60 py-4">
            No high risk entities found
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRiskWidget;

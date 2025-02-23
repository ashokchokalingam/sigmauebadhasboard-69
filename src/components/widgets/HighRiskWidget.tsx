
import { Shield, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimelineView from "../dashboard/TimelineView";
import EntityCard from "./EntityCard";

interface HighRiskWidgetProps {
  entityType: "userOrigin" | "userImpacted" | "computer";
  title: string;
  apiEndpoint: string;
  searchPlaceholder: string;
}

const HighRiskWidget = ({ entityType, title, apiEndpoint, searchPlaceholder }: HighRiskWidgetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

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

  const filteredEntities = useMemo(() => {
    return (entities as any[])
      .filter((entity: any) => {
        const entityName = entityType === 'computer' ? entity.computer : entity.user;
        return entityName?.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a: any, b: any) => parseFloat(b.cumulative_risk_score) - parseFloat(a.cumulative_risk_score));
  }, [entities, entityType, searchQuery]);

  const handleEntityClick = useCallback((entityId: string) => {
    setSelectedEntity(entityId);
  }, []);

  if (selectedEntity) {
    const timelineEntityType = entityType === 'userOrigin' ? 'userorigin' :
                              entityType === 'userImpacted' ? 'userimpacted' :
                              'computersimpacted';
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <TimelineView
          entityType={timelineEntityType}
          entityId={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          inSidebar={false}
        />
      </div>
    );
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[#9b87f5]" />
          <span className="text-lg font-semibold text-[#D6BCFA]">{title}</span>
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
            entityType={entityType.toLowerCase() as 'computer' | 'userOrigin' | 'userImpacted'}
            onClick={() => handleEntityClick(entityType === 'computer' ? entity.computer : entity.user)}
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

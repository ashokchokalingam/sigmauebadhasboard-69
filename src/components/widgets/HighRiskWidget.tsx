
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
    <div className="bg-[#0A0B0F] border border-[#5856D6]/20 rounded-xl overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-[#5856D6]/20">
        <div className="flex items-center gap-2 text-sm font-medium text-[#D6BCFA]">
          <Shield className="h-5 w-5 text-[#9b87f5]" />
          {title}
        </div>
        <div className="text-xs font-medium text-[#9b87f5] px-2 py-1 rounded-full 
          bg-[#5856D6]/10 border border-[#5856D6]/20">
          {filteredEntities.length} active
        </div>
      </div>

      <div className="p-3 border-b border-[#5856D6]/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b87f5]/50" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5
              bg-[#0A0B0F] hover:bg-[#12131A]
              border border-[#5856D6]/30 hover:border-[#5856D6]/50 
              rounded-lg text-xs text-[#D6BCFA] 
              placeholder:text-[#9b87f5]/50
              transition-colors duration-200
              focus:outline-none focus:ring-1 focus:ring-[#5856D6]/30"
          />
        </div>
      </div>
      
      <div className="px-4 pb-4 space-y-2 overflow-y-auto h-[calc(100%-120px)]
        scrollbar-thin scrollbar-thumb-[#5856D6]/20 scrollbar-track-transparent">
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

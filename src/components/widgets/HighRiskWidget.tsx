
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
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
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
    <Card className="bg-[#0A0B0F]/40 border-[#5856D6]/20 hover:bg-[#0A0B0F]/60 
                    transition-all duration-300 h-[500px] backdrop-blur-sm">
      <CardHeader className="p-6 border-b border-[#5856D6]/20">
        <CardTitle className="flex items-center gap-3 text-[#D6BCFA]">
          <Shield className="h-5 w-5 text-[#9b87f5]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b87f5]/50" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 
                       bg-[#0A0B0F]/40 border border-[#5856D6]/30 
                       rounded-lg text-[#D6BCFA] placeholder:text-[#9b87f5]/50
                       focus:outline-none focus:ring-1 focus:ring-[#5856D6]/30
                       transition-all duration-200 backdrop-blur-sm"
            />
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#5856D6]/20 
                        scrollbar-track-transparent" style={{ height: 'calc(500px - 140px)' }}>
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
      </CardContent>
    </Card>
  );
};

export default HighRiskWidget;

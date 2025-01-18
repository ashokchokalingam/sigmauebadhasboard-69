import { Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TimelineView from "../dashboard/TimelineView";

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
      if (!response.ok) {
        throw new Error(`Failed to fetch ${title}`);
      }
      const data = await response.json();
      const key = Object.keys(data)[0];
      return data[key] || [];
    }
  });

  const filteredEntities = entities.filter((entity: any) => {
    const entityName = entityType === 'computer' ? entity.computer : entity.user;
    return entityName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleEntityClick = (entityId: string) => {
    setSelectedEntity(entityId);
  };

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
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <Shield className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-purple-950/20 border-purple-900/30 text-purple-100 placeholder:text-purple-400/50"
          />
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredEntities.map((entity: any, index: number) => {
              const entityId = entityType === 'computer' ? entity.computer : entity.user;
              const riskScore = parseFloat(entity.cumulative_risk_score);
              
              return (
                <div
                  key={index}
                  className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/30 hover:bg-purple-950/30 transition-all duration-300 cursor-pointer"
                  onClick={() => handleEntityClick(entityId)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-purple-100 font-mono">{entityId}</span>
                    <span className={`font-mono font-bold ${
                      riskScore >= 80 ? 'text-red-500' :
                      riskScore >= 60 ? 'text-orange-500' :
                      'text-yellow-500'
                    }`}>
                      {riskScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
            {filteredEntities.length === 0 && (
              <div className="text-center text-purple-400/60 py-4">
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
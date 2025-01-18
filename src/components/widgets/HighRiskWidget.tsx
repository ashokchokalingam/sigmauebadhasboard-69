import { Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
  const [statIndex, setStatIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatIndex((prev) => (prev + 1) % 3);
    }, 800);

    return () => clearInterval(interval);
  }, []);

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
    } = entities
    .filter((entity: any) => {
      const entityName = entityType === 'computer' ? entity.computer : entity.user;
      return entityName?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a: any, b: any) => {
      return parseFloat(b.cumulative_risk_score) - parseFloat(a.cumulative_risk_score);
    });

  const handleEntityClick = (entityId: string) => {
    setSelectedEntity(entityId);
  };

  const getRiskColor = (score: number): string => {
    if (score >= 200) return "text-[#ea384c]";
    if (score >= 50) return "text-orange-500";
    return "text-yellow-500";
  };

  const getRiskLevel = (score: number): string => {
    if (score >= 200) return "critical";
    if (score >= 50) return "high";
    return "medium";
  };

  const getRotatingStats = (entity: any) => {
    const stats = [
      { label: "Unique Outliers", value: entity.unique_outliers },
      { label: "Unique Tactics", value: entity.unique_tactics_count },
      { label: "Unique Threat Names", value: entity.unique_title_count }
    ];
    return stats[statIndex];
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
    <Card className="bg-black/40 border-purple-900/20 hover:bg-black/50 transition-all duration-300 h-[500px]">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-3 text-purple-100">
          <Shield className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-purple-950/20 border-purple-900/30 text-purple-100 placeholder:text-purple-400/50"
          />
          <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-900/20 scrollbar-track-transparent" 
               style={{ height: 'calc(500px - 140px)' }}>
            {filteredEntities.map((entity: any, index: number) => {
              const entityId = entityType === 'computer' ? entity.computer : entity.user;
              const riskScore = parseFloat(entity.cumulative_risk_score);
              const riskLevel = getRiskLevel(riskScore);
              const currentStat = getRotatingStats(entity);
              
              return (
                <div
                  key={index}
                  onClick={() => handleEntityClick(entityId)}
                  className="bg-purple-950/20 p-4 rounded-lg border border-purple-900/30 
                           hover:bg-purple-950/30 transition-all duration-300 cursor-pointer
                           group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-purple-100 font-mono group-hover:text-white transition-colors">
                        {entityId}
                      </span>
                      <span className="text-xs text-purple-400/70 transition-all duration-300">
                        {currentStat.label}: {currentStat.value}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${getRiskColor(riskScore)}`}>
                        {riskLevel} risk
                      </span>
                      <div className="relative w-24 h-8 overflow-hidden">
                        <svg 
                          className={`w-[200%] h-full animate-cardiogram ${getRiskColor(riskScore)}`}
                          viewBox="0 0 600 100" 
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0,50 L100,50 L120,20 L140,80 L160,50 L300,50 L320,20 L340,80 L360,50 L500,50 L520,20 L540,80 L560,50 L600,50"
                            className="stroke-current fill-none stroke-[4]"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className={`font-mono font-bold text-2xl ${getRiskColor(riskScore)} ${
                        riskScore >= 200 ? 'animate-pulse' : ''
                      }`}>
                        {riskScore.toFixed(1)}
                      </span>
                    </div>
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
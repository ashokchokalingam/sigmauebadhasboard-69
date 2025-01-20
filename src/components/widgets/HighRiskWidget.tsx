import { Shield, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      if (!response.ok) throw new Error(`Failed to fetch ${title}`);
      const data = await response.json();
      const key = Object.keys(data)[0];
      return data[key] || [];
    }
  });

  const filteredEntities = (entities as any[])
    .filter((entity: any) => {
      const entityName = entityType === 'computer' ? entity.computer : entity.user;
      return entityName?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a: any, b: any) => parseFloat(b.cumulative_risk_score) - parseFloat(a.cumulative_risk_score));

  const getRiskLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score >= 200) return { 
      level: "critical risk", 
      color: "text-risk-critical",
      bgColor: "bg-risk-critical/10"
    };
    if (score >= 100) return { 
      level: "high risk", 
      color: "text-risk-high",
      bgColor: "bg-risk-high/10"
    };
    if (score >= 50) return { 
      level: "medium risk", 
      color: "text-risk-medium",
      bgColor: "bg-risk-medium/10"
    };
    return { 
      level: "low risk", 
      color: "text-risk-low",
      bgColor: "bg-risk-low/10"
    };
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
    <Card className="bg-[#1A1F2C] border-purple-900/20 hover:bg-[#1E2334] transition-all duration-300 h-[500px]">
      <CardHeader className="p-6 border-b border-purple-900/20">
        <CardTitle className="flex items-center gap-3 text-purple-100">
          <Shield className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/50" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#151823] border border-purple-900/30 
                         rounded-lg text-purple-100 placeholder:text-purple-400/50
                         focus:outline-none focus:ring-1 focus:ring-purple-500/30
                         transition-all duration-200"
            />
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-900/20 
                        scrollbar-track-transparent" style={{ height: 'calc(500px - 140px)' }}>
            {filteredEntities.map((entity: any, index: number) => {
              const entityId = entityType === 'computer' ? entity.computer : entity.user;
              const riskScore = parseFloat(entity.cumulative_risk_score);
              const { level, color, bgColor } = getRiskLevel(riskScore);
              
              return (
                <div
                  key={index}
                  onClick={() => setSelectedEntity(entityId)}
                  className="bg-[#151823] p-4 rounded-lg border border-purple-900/30 
                           hover:bg-[#1A1F2C] transition-all duration-300 cursor-pointer
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
                      <span className={`text-sm font-medium ${color}`}>
                        {level}
                      </span>
                      <div className="relative w-24 h-8 overflow-hidden">
                        <svg 
                          className={`w-[200%] h-full animate-cardiogram ${color}`}
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
                      <div className={`px-4 py-2 rounded-lg ${bgColor}`}>
                        <span className={`font-mono font-bold text-2xl ${color} ${
                          riskScore >= 200 ? 'animate-pulse' : ''
                        }`}>
                          {riskScore.toFixed(1)}
                        </span>
                      </div>
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

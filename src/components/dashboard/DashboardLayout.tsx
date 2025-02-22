
import { Download, Shield, Activity, Brain } from "lucide-react";
import { Alert } from "./types";
import StatsSection from "./StatsSection";
import RiskyEntities from "./RiskyEntities";
import TimelineView from "./TimelineView";
import AnomaliesTable from "./AnomaliesTable";
import { calculateStats } from "./alertUtils";
import HighRiskUsersOriginWidget from "../HighRiskUsersOriginWidget";
import HighRiskUsersImpactedWidget from "../HighRiskUsersImpactedWidget";
import HighRiskComputersWidget from "../HighRiskComputersWidget";
import OutliersWidget from "../OutliersWidget";

interface DashboardLayoutProps {
  alerts: Alert[];
  allAlerts: Alert[];
  totalRecords: number;
  isLoading: boolean;
  onEntitySelect: (entity: { type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null) => void;
  selectedEntity: { type: "userorigin" | "userimpacted" | "computersimpacted"; id: string } | null;
  onLoadMore: () => void;
  hasMore: boolean;
}

const DashboardLayout = ({
  alerts,
  allAlerts,
  totalRecords,
  isLoading,
  onEntitySelect,
  selectedEntity,
  onLoadMore,
  hasMore
}: DashboardLayoutProps) => {
  const stats = calculateStats(allAlerts, totalRecords);

  if (selectedEntity) {
    return (
      <TimelineView
        entityType={selectedEntity.type}
        entityId={selectedEntity.id}
        onClose={() => onEntitySelect(null)}
        inSidebar={false}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#1A1F2C] bg-gradient-to-br from-[#1A1F2C] to-[#121212] pt-2 px-4 md:px-6">
      <div className="mb-3 relative">
        <div className="absolute -left-2 -top-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-violet-500/10 rounded-lg blur-xl" />
        <div className="relative bg-black/40 rounded-lg border border-blue-500/10 px-5 py-3 backdrop-blur-sm">
          <div className="max-w-full lg:max-w-[80%]">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-400" />
                <Brain className="h-6 w-6 text-purple-400" />
                <Activity className="h-6 w-6 text-violet-400" />
              </div>
              <div className="h-6 w-[1px] bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-violet-500/20" />
              <span className="text-sm font-medium text-blue-300/80 tracking-wider">
                ENTERPRISE SECURITY ANALYTICS
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-1.5">
              <span className="inline bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400">
                ML-Powered ATT&CK User Behavior Analytics
              </span>
            </h1>
            
            <div className="text-sm text-blue-300/60 max-w-lg">
              Advanced threat detection powered by machine learning and MITRE ATT&CK framework
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <StatsSection stats={stats} totalAlerts={totalRecords} />
      </div>

      <div className="mb-4">
        <OutliersWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <HighRiskUsersOriginWidget />
        <HighRiskUsersImpactedWidget />
        <HighRiskComputersWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-4">
          <RiskyEntities 
            alerts={allAlerts} 
            type="users-origin"
            onEntitySelect={(id) => onEntitySelect({ type: "userorigin", id })}
          />
        </div>
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-4">
          <RiskyEntities 
            alerts={allAlerts} 
            type="users-impacted"
            onEntitySelect={(id) => onEntitySelect({ type: "userimpacted", id })}
          />
        </div>
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-4">
          <RiskyEntities 
            alerts={allAlerts} 
            type="computers"
            onEntitySelect={(id) => onEntitySelect({ type: "computersimpacted", id })}
          />
        </div>
      </div>

      <div className="bg-black/40 rounded-lg backdrop-blur-sm border border-blue-500/10">
        <AnomaliesTable 
          alerts={alerts.slice(0, 1000)} 
          onLoadMore={onLoadMore}
          hasMore={hasMore}
        />
      </div>

      {isLoading && alerts.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Loading more data... ({alerts.length} / {totalRecords})
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

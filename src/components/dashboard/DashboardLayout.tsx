import { Download } from "lucide-react";
import { Alert } from "./types";
import StatsSection from "./StatsSection";
import RiskyEntities from "./RiskyEntities";
import TimelineView from "./TimelineView";
import AnomaliesTable from "./AnomaliesTable";
import { calculateStats } from "./alertUtils";
import HighRiskUsersOriginWidget from "../HighRiskUsersOriginWidget";
import HighRiskUsersImpactedWidget from "../HighRiskUsersImpactedWidget";
import HighRiskAssetsWidget from "../HighRiskAssetsWidget";
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
    <div className="min-h-screen w-full bg-[#1A1F2C] bg-gradient-to-br from-[#1A1F2C] to-[#121212] p-4 md:p-6">
      <div className="flex flex-col gap-6 lg:flex-row items-center justify-between mb-6 bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-blue-500/10">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">
          ATT&CK User Behavior Analytics
        </h1>
        <button className="flex items-center gap-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all duration-300 rounded-lg px-4 py-2 border border-blue-500/10">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <div className="w-full bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-blue-500/10 mb-6">
        <StatsSection stats={stats} totalAlerts={totalRecords} />
      </div>

      <div className="w-full bg-black/40 border border-purple-500/10 rounded-lg p-4 md:p-6 mb-6 min-h-[500px]">
        <OutliersWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-4 md:p-6">
          <HighRiskUsersOriginWidget />
        </div>
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-4 md:p-6">
          <HighRiskUsersImpactedWidget />
        </div>
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-4 md:p-6">
          <HighRiskAssetsWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-4 md:p-6">
          <RiskyEntities 
            alerts={allAlerts} 
            type="users-origin"
            onEntitySelect={(id) => onEntitySelect({ type: "userorigin", id })}
          />
        </div>
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-4 md:p-6">
          <RiskyEntities 
            alerts={allAlerts} 
            type="users-impacted"
            onEntitySelect={(id) => onEntitySelect({ type: "userimpacted", id })}
          />
        </div>
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-4 md:p-6">
          <RiskyEntities 
            alerts={allAlerts} 
            type="computers"
            onEntitySelect={(id) => onEntitySelect({ type: "computersimpacted", id })}
          />
        </div>
      </div>

      <div className="w-full bg-black/40 rounded-lg backdrop-blur-sm border border-blue-500/10">
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
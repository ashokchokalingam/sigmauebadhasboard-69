import { Download } from "lucide-react";
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
    <div className="min-h-screen w-full bg-[#1A1F2C] bg-gradient-to-br from-[#1A1F2C] to-[#121212]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] text-center sm:text-left">
            ATT&CK User Behavior Analytics
          </h1>
          <button className="flex items-center gap-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all duration-300 rounded-lg px-4 py-2 border border-blue-500/10 whitespace-nowrap">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>

        {/* Stats Section - Now responsive */}
        <div className="mb-6">
          <StatsSection stats={stats} totalAlerts={totalRecords} />
        </div>

        {/* Outliers Widget - Full width on mobile, responsive on larger screens */}
        <div className="mb-6">
          <OutliersWidget />
        </div>

        {/* High Risk Widgets - Stack on mobile, grid on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <div className="w-full">
            <HighRiskUsersOriginWidget />
          </div>
          <div className="w-full">
            <HighRiskUsersImpactedWidget />
          </div>
          <div className="w-full">
            <HighRiskComputersWidget />
          </div>
        </div>

        {/* Active Users Widgets - Stack on mobile, grid on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <div className="w-full bg-black/40 border border-blue-500/10 rounded-lg p-4">
            <RiskyEntities 
              alerts={allAlerts} 
              type="users-origin"
              onEntitySelect={(id) => onEntitySelect({ type: "userorigin", id })}
            />
          </div>
          <div className="w-full bg-black/40 border border-blue-500/10 rounded-lg p-4">
            <RiskyEntities 
              alerts={allAlerts} 
              type="users-impacted"
              onEntitySelect={(id) => onEntitySelect({ type: "userimpacted", id })}
            />
          </div>
          <div className="w-full bg-black/40 border border-blue-500/10 rounded-lg p-4">
            <RiskyEntities 
              alerts={allAlerts} 
              type="computers"
              onEntitySelect={(id) => onEntitySelect({ type: "computersimpacted", id })}
            />
          </div>
        </div>

        {/* Anomalies Table Section */}
        <div className="mt-6">
          <div className="bg-black/40 rounded-lg backdrop-blur-sm border border-blue-500/10 overflow-x-auto">
            <AnomaliesTable 
              alerts={alerts.slice(0, 1000)} 
              onLoadMore={onLoadMore}
              hasMore={hasMore}
            />
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && alerts.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            Loading more data... ({alerts.length} / {totalRecords})
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
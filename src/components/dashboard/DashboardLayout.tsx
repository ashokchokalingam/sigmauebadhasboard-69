import { Download } from "lucide-react";
import { Alert } from "./types";
import StatsSection from "./StatsSection";
import TacticsChart from "./TacticsChart";
import SeverityChart from "./SeverityChart";
import RiskyEntities from "./RiskyEntities";
import TimelineView from "./TimelineView";
import AnomaliesTable from "./AnomaliesTable";
import { calculateStats } from "./alertUtils";
import { Button } from "../ui/button";

interface DashboardLayoutProps {
  alerts: Alert[];
  totalRecords: number;
  isLoading: boolean;
  onEntitySelect: (entity: { type: "user" | "computer"; id: string } | null) => void;
  selectedEntity: { type: "user" | "computer"; id: string } | null;
  onLoadMore: () => void;
  hasMore: boolean;
}

const DashboardLayout = ({
  alerts,
  totalRecords,
  isLoading,
  onEntitySelect,
  selectedEntity,
  onLoadMore,
  hasMore
}: DashboardLayoutProps) => {
  const stats = calculateStats(alerts);

  if (selectedEntity) {
    return (
      <TimelineView
        alerts={alerts}
        entityType={selectedEntity.type}
        entityId={selectedEntity.id}
        onClose={() => onEntitySelect(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#121212] p-6">
      <div className="flex flex-col gap-6 lg:flex-row items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">
          Exabeam Anomaly Hunter Dashboard
        </h1>
        <button className="flex items-center gap-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all duration-300 rounded-lg px-4 py-2 border border-blue-500/10">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <StatsSection stats={stats} totalAlerts={totalRecords} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TacticsChart 
          alerts={alerts} 
          onTacticSelect={() => {}} 
        />
        <SeverityChart 
          alerts={alerts} 
          onSeveritySelect={() => {}} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-6">
          <RiskyEntities 
            alerts={alerts} 
            type="users"
            onEntitySelect={(id) => onEntitySelect({ type: "user", id })}
          />
        </div>
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-6">
          <RiskyEntities 
            alerts={alerts} 
            type="computers"
            onEntitySelect={(id) => onEntitySelect({ type: "computer", id })}
          />
        </div>
      </div>

      <div className="w-full">
        <AnomaliesTable alerts={alerts} />
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Loading..." : "Load More Alerts"}
          </Button>
        </div>
      )}

      {isLoading && alerts.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Loading more data... ({alerts.length} / {totalRecords})
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
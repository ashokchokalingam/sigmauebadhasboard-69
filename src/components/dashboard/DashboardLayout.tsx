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
import { useQuery } from "@tanstack/react-query";

interface DashboardLayoutProps {
  alerts: Alert[];
  allAlerts: Alert[];
  totalRecords: number;
  isLoading: boolean;
  onEntitySelect: (entity: { type: "user" | "computer"; id: string } | null) => void;
  selectedEntity: { type: "user" | "computer"; id: string } | null;
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
  const { data: totalCount } = useQuery({
    queryKey: ['totalCount'],
    queryFn: async () => {
      const response = await fetch('/api/total_count');
      if (!response.ok) {
        throw new Error('Failed to fetch total count');
      }
      const data = await response.json();
      return data.count;
    }
  });

  const stats = calculateStats(allAlerts, totalCount || totalRecords);

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
    <div className="min-h-screen bg-[#1A1F2C] bg-gradient-to-br from-[#1A1F2C] to-[#121212] p-6">
      <div className="flex flex-col gap-6 lg:flex-row items-center justify-between mb-8 bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-blue-500/10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">
          Exabeam Event Dashboard
        </h1>
        <button className="flex items-center gap-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all duration-300 rounded-lg px-4 py-2 border border-blue-500/10">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-blue-500/10 mb-8">
        <StatsSection stats={stats} totalAlerts={totalCount || totalRecords} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-6">
          <RiskyEntities 
            alerts={allAlerts} 
            type="users"
            onEntitySelect={(id) => onEntitySelect({ type: "user", id })}
          />
        </div>
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-6">
          <RiskyEntities 
            alerts={allAlerts} 
            type="computers"
            onEntitySelect={(id) => onEntitySelect({ type: "computer", id })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-blue-500/10">
          <TacticsChart 
            onTacticSelect={() => {}} 
          />
        </div>
        <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-blue-500/10">
          <SeverityChart 
            onSeveritySelect={() => {}} 
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
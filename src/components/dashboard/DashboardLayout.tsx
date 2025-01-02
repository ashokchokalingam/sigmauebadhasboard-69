import { Alert } from "./types";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import StatsSection from "./StatsSection";
import AnomaliesTable from "./AnomaliesTable";
import TimelineView from "./TimelineView";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { calculateStats } from "./alertUtils";
import RiskyEntities from "./RiskyEntities";
import TacticsChart from "./TacticsChart";
import AlertDistribution from "./AlertDistribution";
import CriticalUsers from "../CriticalUsers";

interface DashboardLayoutProps {
  alerts: Alert[];
  allAlerts: Alert[];
  totalRecords: number;
  isLoading: boolean;
  onEntitySelect: (entity: { type: "user" | "computer"; id: string } | null) => void;
  selectedEntity: { type: "user" | "computer"; id: string } | null;
  onLoadMore: () => Promise<void>;
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
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    setShowTimeline(true);
    onEntitySelect({ type, id });
  };

  const handleCloseTimeline = () => {
    setShowTimeline(false);
    onEntitySelect(null);
  };

  const stats = calculateStats(allAlerts, totalRecords);

  // Calculate critical users data
  const criticalUsers = allAlerts
    .filter(alert => alert.rule_level === 'critical' || alert.dbscan_cluster === -1)
    .reduce((acc: any[], alert) => {
      const existingUser = acc.find(u => u.user === alert.user_id);
      if (existingUser) {
        existingUser.risk += 10;
        if (!existingUser.tactics.includes(alert.tags)) {
          existingUser.tactics.push(alert.tags);
        }
      } else if (alert.user_id) {
        acc.push({
          user: alert.user_id,
          risk: 10,
          tactics: [alert.tags]
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 5);

  return (
    <div className="container mx-auto p-4 space-y-6 min-h-screen">
      <StatsSection 
        stats={stats}
        totalAlerts={allAlerts.length}
        alerts={allAlerts}
        totalRecords={totalRecords}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TacticsChart onTacticSelect={setSelectedTactic} />
        </div>
        <div>
          <AlertDistribution alerts={allAlerts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="space-y-6">
          <Card className="bg-black/40 border-blue-500/10">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-100 mb-4">Risky Users</h2>
              <RiskyEntities
                alerts={allAlerts}
                type="users"
                onEntitySelect={(id) => handleTimelineView("user", id)}
              />
            </div>
          </Card>
          <Card className="bg-black/40 border-blue-500/10">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-100 mb-4">Risky Computers</h2>
              <RiskyEntities
                alerts={allAlerts}
                type="computers"
                onEntitySelect={(id) => handleTimelineView("computer", id)}
              />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <CriticalUsers users={criticalUsers} />
        </div>
      </div>

      {selectedEntity && showTimeline ? (
        <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg">
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="h-full">
              <AnomaliesTable
                alerts={alerts}
                onLoadMore={onLoadMore}
                hasMore={hasMore}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={30} minSize={20}>
            <Card className="h-full bg-black/40 border-blue-500/10">
              <TimelineView
                alerts={allAlerts}
                entityType={selectedEntity.type}
                entityId={selectedEntity.id}
                onClose={handleCloseTimeline}
                inSidebar={true}
              />
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <AnomaliesTable
          alerts={alerts}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
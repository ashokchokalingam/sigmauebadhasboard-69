import { Alert } from "./types";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import StatsSection from "./StatsSection";
import AnomaliesTable from "./AnomaliesTable";
import TimelineView from "./TimelineView";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { calculateStats } from "./alertUtils";

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

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    setShowTimeline(true);
    onEntitySelect({ type, id });
  };

  const handleCloseTimeline = () => {
    setShowTimeline(false);
    onEntitySelect(null);
  };

  const stats = calculateStats(allAlerts, totalRecords);

  return (
    <div className="min-h-screen bg-[#1a1f2c] w-full">
      <div className="p-4 md:p-6 space-y-6 max-w-[2000px] mx-auto">
        <StatsSection 
          stats={stats}
          totalAlerts={allAlerts.length}
          alerts={allAlerts}
          totalRecords={totalRecords}
        />

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
    </div>
  );
};

export default DashboardLayout;
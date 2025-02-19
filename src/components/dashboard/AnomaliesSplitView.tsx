
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Table } from "@/components/ui/table";
import { Alert } from "./types";
import AlertDetailsView from "./AlertDetailsView";
import AnomaliesTableHeader from "./AnomaliesTableHeader";
import AnomaliesTableContent from "./AnomaliesTableContent";

interface AnomaliesSplitViewProps {
  selectedAlert: Alert;
  alerts: Alert[];
  onFilterChange: (column: string, value: string) => void;
  filters: Record<string, string>;
  visibleColumns: string[];
  onAlertSelect: (alert: Alert) => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  filteredAlerts: Alert[];
  onClose: () => void;
}

const AnomaliesSplitView = ({
  selectedAlert,
  alerts,
  onFilterChange,
  filters,
  visibleColumns,
  onAlertSelect,
  onTimelineView,
  filteredAlerts,
  onClose
}: AnomaliesSplitViewProps) => {
  return (
    <div className="h-full w-full">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-[800px] w-full rounded-lg border border-blue-500/10"
      >
        <ResizablePanel defaultSize={70} minSize={30} maxSize={85}>
          <div className="h-full w-full flex flex-col border-r border-blue-500/10">
            <div className="sticky top-0 z-50 bg-[#0A0D14]">
              <table className="w-full border-collapse">
                <AnomaliesTableHeader
                  alerts={alerts}
                  onFilterChange={onFilterChange}
                  filters={filters}
                  visibleColumns={visibleColumns}
                />
              </table>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <AnomaliesTableContent
                  alerts={filteredAlerts}
                  selectedAlert={selectedAlert}
                  onAlertSelect={onAlertSelect}
                  onTimelineView={onTimelineView}
                  visibleColumns={visibleColumns}
                />
              </table>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle 
          withHandle 
          className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
        />
        
        <ResizablePanel defaultSize={30} minSize={15} maxSize={70}>
          <div className="h-full overflow-auto">
            <AlertDetailsView
              alert={selectedAlert}
              onClose={onClose}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default AnomaliesSplitView;

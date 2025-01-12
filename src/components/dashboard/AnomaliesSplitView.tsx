import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Table } from "@/components/ui/table";
import { Alert } from "./types";
import AlertDetailsView from "./AlertDetailsView";
import AnomaliesTableHeader from "./AnomaliesTableHeader";
import AnomaliesTableContent from "./AnomaliesTableContent";

interface AnomaliesSplitViewProps {
  selectedAlert?: Alert;
  alerts?: Alert[];
  onFilterChange?: (column: string, value: string) => void;
  filters?: Record<string, string>;
  visibleColumns: string[];
  onAlertSelect?: (alert: Alert) => void;
  onTimelineView?: (type: "user" | "computer", id: string) => void;
  filteredAlerts?: Alert[];
  onClose: () => void;
  entityType: "user" | "computer";
  entityId: string;
}

const AnomaliesSplitView = ({
  selectedAlert,
  alerts = [],
  onFilterChange = () => {},
  filters = {},
  visibleColumns,
  onAlertSelect = () => {},
  onTimelineView = () => {},
  filteredAlerts = [],
  onClose,
  entityType,
  entityId
}: AnomaliesSplitViewProps) => {
  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="min-h-[800px] rounded-lg border border-blue-500/10"
    >
      <ResizablePanel defaultSize={75} minSize={30}>
        <div className="h-full overflow-hidden border-r border-blue-500/10">
          <div className="relative h-full">
            <div className="overflow-x-auto">
              <div className="overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-blue-500/10 scrollbar-track-transparent">
                <Table>
                  <AnomaliesTableHeader
                    alerts={alerts}
                    onFilterChange={onFilterChange}
                    filters={filters}
                    visibleColumns={visibleColumns}
                  />
                  <AnomaliesTableContent
                    alerts={filteredAlerts}
                    selectedAlert={selectedAlert}
                    onAlertSelect={onAlertSelect}
                    onTimelineView={onTimelineView}
                    visibleColumns={visibleColumns}
                  />
                </Table>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      
      <ResizableHandle 
        withHandle 
        className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
      />
      
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="h-full">
          {selectedAlert && (
            <AlertDetailsView
              alert={selectedAlert}
              onClose={onClose}
            />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AnomaliesSplitView;
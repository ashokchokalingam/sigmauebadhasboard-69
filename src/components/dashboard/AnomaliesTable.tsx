import { Table } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Alert } from "./types";
import { Button } from "../ui/button";
import { ALERTS_PER_PAGE } from "@/constants/pagination";
import { defaultColumns } from "./TableConfig";
import AlertDetailsView from "./AlertDetailsView";
import AnomaliesTableHeader from "./AnomaliesTableHeader";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ColumnSelector from "./ColumnSelector";
import { useToast } from "../ui/use-toast";
import { useAlertsFilter } from "./hooks/useAlertsFilter";
import AnomaliesTableContent from "./AnomaliesTableContent";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultColumns.map(col => col.key)
  );
  const { toast } = useToast();
  const { filters, handleFilterChange, filterAlerts } = useAlertsFilter(alerts, visibleColumns);

  const handleAlertSelect = (alert: Alert) => {
    setSelectedAlert(selectedAlert?.id === alert.id ? null : alert);
  };

  const handleColumnToggle = (columns: string[]) => {
    setVisibleColumns(columns);
    
    toast({
      title: "Column Changes Applied",
      description: "The selected columns and their filters have been updated",
    });
  };

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    console.log("Timeline view requested for:", type, id);
  };

  const filteredAlerts = filterAlerts();

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-100">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              Recent Events - Last 7 Days (Limited to 1000)
            </CardTitle>
            <ColumnSelector
              visibleColumns={visibleColumns}
              onColumnToggle={handleColumnToggle}
            />
          </div>
        </CardHeader>
        <CardContent>
          {selectedAlert ? (
            <ResizablePanelGroup 
              direction="horizontal" 
              className="min-h-[800px] rounded-lg border border-blue-500/10"
              onLayout={(sizes) => {
                // Prevent panel from closing when resizing
                console.log("Layout changed:", sizes);
              }}
            >
              <ResizablePanel defaultSize={75} minSize={30}>
                <div className="h-full overflow-hidden border-r border-blue-500/10">
                  <div className="relative h-full">
                    <div className="overflow-x-auto">
                      <div className="overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-blue-500/10 scrollbar-track-transparent">
                        <Table>
                          <AnomaliesTableHeader
                            alerts={alerts}
                            onFilterChange={handleFilterChange}
                            filters={filters}
                            visibleColumns={visibleColumns}
                          />
                          <AnomaliesTableContent
                            alerts={filteredAlerts}
                            selectedAlert={selectedAlert}
                            onAlertSelect={handleAlertSelect}
                            onTimelineView={handleTimelineView}
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
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
              
              <ResizablePanel defaultSize={25} minSize={20}>
                <div className="h-full">
                  <AlertDetailsView
                    alert={selectedAlert}
                    onClose={() => setSelectedAlert(null)}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="overflow-hidden border border-blue-500/10 rounded-md">
              <div className="relative">
                <div className="overflow-x-auto">
                  <div className="overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-blue-500/10 scrollbar-track-transparent">
                    <Table>
                      <AnomaliesTableHeader
                        alerts={alerts}
                        onFilterChange={handleFilterChange}
                        filters={filters}
                        visibleColumns={visibleColumns}
                      />
                      <AnomaliesTableContent
                        alerts={filteredAlerts}
                        selectedAlert={selectedAlert}
                        onAlertSelect={handleAlertSelect}
                        onTimelineView={handleTimelineView}
                        visibleColumns={visibleColumns}
                      />
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {hasMore && filteredAlerts.length >= ALERTS_PER_PAGE && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={onLoadMore}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Load More Events
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnomaliesTable;
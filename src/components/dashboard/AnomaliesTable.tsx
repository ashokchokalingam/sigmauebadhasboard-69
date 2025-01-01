import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";
import { Alert } from "./types";
import { Button } from "../ui/button";
import { ALERTS_PER_PAGE } from "@/constants/pagination";
import AlertTableRow from "./AlertTableRow";
import { defaultColumns } from "./TableConfig";
import AlertDetailsView from "./AlertDetailsView";
import AnomaliesTableHeader from "./AnomaliesTableHeader";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const sortedAlerts = [...alerts]
    .filter(alert => {
      const alertDate = new Date(alert.system_time);
      return alertDate >= sevenDaysAgo;
    })
    .sort((a, b) => 
      new Date(b.system_time).getTime() - new Date(a.system_time).getTime()
    )
    .slice(0, 1000);

  const filteredAlerts = sortedAlerts.slice(0, ALERTS_PER_PAGE);

  const handleAlertSelect = (alert: Alert) => {
    setSelectedAlert(selectedAlert?.id === alert.id ? null : alert);
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value === prev[column] ? '' : value
    }));
  };

  const tableContent = (
    <div className="overflow-hidden border border-blue-500/10 rounded-md">
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-blue-500/10 scrollbar-track-transparent">
            <Table>
              <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-blue-500/10">
                <AnomaliesTableHeader
                  alerts={alerts}
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  visibleColumns={defaultColumns.map(col => col.key)}
                />
              </div>
              <TableBody className="w-full">
                {filteredAlerts.map((alert) => (
                  <AlertTableRow
                    key={alert.id}
                    alert={alert}
                    isSelected={selectedAlert?.id === alert.id}
                    onToggle={() => handleAlertSelect(alert)}
                    onTimelineView={() => {}}
                    visibleColumns={defaultColumns.map(col => col.key)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-100">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            Recent Events - Last 7 Days (Limited to 1000)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAlert ? (
            <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border border-blue-500/10">
              <ResizablePanel defaultSize={75} minSize={30}>
                {tableContent}
              </ResizablePanel>
              
              <ResizableHandle withHandle className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors" />
              
              <ResizablePanel defaultSize={25} minSize={20}>
                <AlertDetailsView
                  alert={selectedAlert}
                  onClose={() => setSelectedAlert(null)}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            tableContent
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
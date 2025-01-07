import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import { Button } from "../ui/button";
import { ALERTS_PER_PAGE } from "@/constants/pagination";
import { useToast } from "../ui/use-toast";
import { useAlertsFilter } from "./hooks/useAlertsFilter";
import AnomaliesTableHeaderSection from "./AnomaliesTableHeaderSection";
import AnomaliesSplitView from "./AnomaliesSplitView";
import AnomaliesMainView from "./AnomaliesMainView";
import { defaultColumns } from "./TableConfig";
import { useState } from "react";

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
        <AnomaliesTableHeaderSection
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
        />
        <CardContent>
          {selectedAlert ? (
            <AnomaliesSplitView
              selectedAlert={selectedAlert}
              alerts={alerts}
              onFilterChange={handleFilterChange}
              filters={filters}
              visibleColumns={visibleColumns}
              onAlertSelect={handleAlertSelect}
              onTimelineView={handleTimelineView}
              filteredAlerts={filteredAlerts}
              onClose={() => setSelectedAlert(null)}
            />
          ) : (
            <AnomaliesMainView
              alerts={alerts}
              onFilterChange={handleFilterChange}
              filters={filters}
              visibleColumns={visibleColumns}
              selectedAlert={selectedAlert}
              onAlertSelect={handleAlertSelect}
              onTimelineView={handleTimelineView}
              filteredAlerts={filteredAlerts}
            />
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
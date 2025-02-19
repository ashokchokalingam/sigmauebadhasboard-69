
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import { defaultColumns } from "./TableConfig";
import { useAlertsFilter } from "./hooks/useAlertsFilter";
import AnomaliesTableView from "./AnomaliesTableView";
import AnomaliesTableHeaderSection from "./AnomaliesTableHeaderSection";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultColumns.map((col) => col.key)
  );

  const { filters, filteredAlerts, handleFilterChange } = useAlertsFilter(alerts);

  const handleColumnToggle = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  const handleSelectAll = () => {
    const allColumnKeys = defaultColumns.map(col => col.key);
    setVisibleColumns(allColumnKeys);
  };

  const handleDeselectAll = () => {
    setVisibleColumns(['system_time']);
  };

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    console.log("Timeline view requested for:", type, id);
  };

  return (
    <Card className="relative border-blue-500/10">
      <AnomaliesTableHeaderSection
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />
      <CardContent className="p-0">
        <AnomaliesTableView
          alerts={alerts}
          selectedAlert={selectedAlert}
          onFilterChange={handleFilterChange}
          filters={filters}
          visibleColumns={visibleColumns}
          onAlertSelect={setSelectedAlert}
          onTimelineView={handleTimelineView}
          filteredAlerts={filteredAlerts}
          onClose={() => setSelectedAlert(null)}
        />
      </CardContent>
    </Card>
  );
};

export default AnomaliesTable;

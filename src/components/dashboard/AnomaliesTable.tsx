import { useState } from "react";
import { Alert } from "./types";
import AnomaliesMainView from "./AnomaliesMainView";
import AnomaliesSplitView from "./AnomaliesSplitView";
import AnomaliesTableHeaderSection from "./AnomaliesTableHeaderSection";
import { useAlertsFilter } from "./hooks/useAlertsFilter";
import InfiniteScrollLoader from "./InfiniteScrollLoader";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [timelineView, setTimelineView] = useState<{
    type: "user" | "computer";
    id: string;
  } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "system_time",
    "users",
    "computer_name",
    "title",
    "description",
  ]);

  const { filters, filteredAlerts, onFilterChange } = useAlertsFilter(alerts, visibleColumns);

  const handleColumnToggle = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  const handleSelectAll = () => {
    setVisibleColumns([
      "system_time",
      "users",
      "computer_name",
      "title",
      "description",
    ]);
  };

  const handleDeselectAll = () => {
    setVisibleColumns([]);
  };

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    setTimelineView({ type, id });
  };

  if (timelineView) {
    return (
      <AnomaliesSplitView
        entityType={timelineView.type}
        entityId={timelineView.id}
        onClose={() => setTimelineView(null)}
        visibleColumns={visibleColumns}
        alerts={alerts}
        onFilterChange={onFilterChange}
        filters={filters}
        selectedAlert={selectedAlert}
        onAlertSelect={setSelectedAlert}
        onTimelineView={handleTimelineView}
        filteredAlerts={filteredAlerts}
      />
    );
  }

  return (
    <div className="flex flex-col bg-[#0A0A0F]">
      <AnomaliesTableHeaderSection
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />
      <AnomaliesMainView
        alerts={alerts}
        onFilterChange={onFilterChange}
        filters={filters}
        visibleColumns={visibleColumns}
        selectedAlert={selectedAlert}
        onAlertSelect={setSelectedAlert}
        onTimelineView={handleTimelineView}
        filteredAlerts={filteredAlerts}
      />
      <InfiniteScrollLoader onLoadMore={onLoadMore} hasMore={hasMore} />
    </div>
  );
};

export default AnomaliesTable;
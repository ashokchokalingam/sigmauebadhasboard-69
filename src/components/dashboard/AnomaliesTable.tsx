import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import { defaultColumns } from "./TableConfig";
import { useAlertsFilter } from "./hooks/useAlertsFilter";
import AnomaliesMainView from "./AnomaliesMainView";

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

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    console.log("Opening timeline view for:", type, id);
  };

  return (
    <Card className="relative border-blue-500/10">
      <CardContent className="p-4">
        <AnomaliesMainView
          alerts={alerts}
          onFilterChange={handleFilterChange}
          filters={filters}
          visibleColumns={visibleColumns}
          selectedAlert={selectedAlert}
          onAlertSelect={setSelectedAlert}
          onTimelineView={handleTimelineView}
          filteredAlerts={filteredAlerts}
        />
        
        {hasMore && (
          <button
            onClick={onLoadMore}
            className="w-full mt-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            Load More
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomaliesTable;
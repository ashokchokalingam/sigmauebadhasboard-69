import { Table } from "@/components/ui/table";
import { Alert } from "./types";
import AnomaliesTableHeader from "./AnomaliesTableHeader";
import AnomaliesTableContent from "./AnomaliesTableContent";

interface AnomaliesMainViewProps {
  alerts: Alert[];
  onFilterChange: (column: string, value: string) => void;
  filters: Record<string, string>;
  visibleColumns: string[];
  selectedAlert: Alert | null;
  onAlertSelect: (alert: Alert) => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  filteredAlerts: Alert[];
}

const AnomaliesMainView = ({
  alerts,
  onFilterChange,
  filters,
  visibleColumns,
  selectedAlert,
  onAlertSelect,
  onTimelineView,
  filteredAlerts
}: AnomaliesMainViewProps) => {
  return (
    <div className="overflow-hidden border border-blue-500/10 rounded-md bg-[#0A0A0F]">
      <div className="relative">
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
  );
};

export default AnomaliesMainView;
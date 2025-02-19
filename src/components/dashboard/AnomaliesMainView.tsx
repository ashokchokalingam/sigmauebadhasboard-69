
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
    <div className="border border-blue-900/20 rounded-md bg-[#0A0D14]">
      <div className="h-[800px] relative">
        <table className="w-full border-collapse [&_tr:hover]:bg-blue-950/30 [&_tr]:border-b [&_tr]:border-blue-900/10">
          <thead className="sticky top-0 bg-[#0A0D14] z-50">
            <AnomaliesTableHeader
              alerts={alerts}
              onFilterChange={onFilterChange}
              filters={filters}
              visibleColumns={visibleColumns}
            />
          </thead>
          <tbody className="overflow-y-auto">
            <AnomaliesTableContent
              alerts={filteredAlerts}
              selectedAlert={selectedAlert}
              onAlertSelect={onAlertSelect}
              onTimelineView={onTimelineView}
              visibleColumns={visibleColumns}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnomaliesMainView;

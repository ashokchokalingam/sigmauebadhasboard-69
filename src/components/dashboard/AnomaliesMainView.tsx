
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
    <div className="overflow-hidden border border-blue-900/20 rounded-md bg-[#0A0D14]">
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="relative max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900/20 scrollbar-track-transparent">
            <Table className="w-full border-collapse [&_tr:hover]:bg-blue-950/30 [&_tr]:border-b [&_tr]:border-blue-900/10">
              <div className="sticky top-0 z-50 bg-[#0A0D14]">
                <AnomaliesTableHeader
                  alerts={alerts}
                  onFilterChange={onFilterChange}
                  filters={filters}
                  visibleColumns={visibleColumns}
                />
              </div>
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

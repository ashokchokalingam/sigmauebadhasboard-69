
import { Table } from "@/components/ui/table";
import { Alert } from "./types";
import AnomaliesTableContent from "./AnomaliesTableContent";
import ResizableHeader from "./ResizableHeader";

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
    <div className="border border-blue-900/20 rounded-md bg-[#0A0D14] h-[800px] flex flex-col">
      <div className="sticky top-0 z-50 bg-[#0A0D14]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {visibleColumns.map((columnKey) => (
                <th 
                  key={columnKey}
                  className="px-4 py-2 text-center bg-[#1A1F2C] border-b border-blue-900/20"
                >
                  <ResizableHeader
                    title={getColumnLabel(columnKey)}
                    columnKey={columnKey}
                    onFilterChange={onFilterChange}
                    selectedValue={filters[columnKey]}
                    alerts={alerts}
                  />
                </th>
              ))}
              <th className="w-[40px] bg-[#1A1F2C] border-b border-blue-900/20" />
            </tr>
          </thead>
        </table>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <tbody>
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

const getColumnLabel = (key: string): string => {
  const labels: Record<string, string> = {
    system_time: 'Time',
    user_id: 'User Origin',
    target_user_name: 'User Impacted',
    computer_name: 'Computer',
    title: 'Title',
    description: 'Description',
    ml_cluster: 'ML Cluster',
    risk: 'Risk Score'
  };
  return labels[key] || key;
};

export default AnomaliesMainView;

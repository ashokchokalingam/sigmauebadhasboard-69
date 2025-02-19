
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
  const getColumnWidth = (columnKey: string): string => {
    switch (columnKey) {
      case 'system_time': return 'w-[180px]';
      case 'user_id': return 'w-[140px]';
      case 'target_user_name': return 'w-[140px]';
      case 'computer_name': return 'w-[160px]';
      case 'title': return 'w-[200px]';
      case 'description': return 'w-[400px]';
      case 'ml_cluster': return 'w-[120px]';
      case 'risk': return 'w-[100px]';
      default: return 'w-[150px]';
    }
  };

  return (
    <div className="border border-blue-900/20 rounded-md bg-[#0A0D14]">
      <div className="h-[800px] overflow-auto">
        <table className="w-full border-collapse [&_tr:hover]:bg-blue-950/30 [&_tr]:border-b [&_tr]:border-blue-900/10">
          <thead className="sticky top-0 bg-[#0A0D14] z-50">
            <tr>
              {visibleColumns.map((columnKey) => (
                <th 
                  key={columnKey}
                  className={`${getColumnWidth(columnKey)} px-4 py-2 text-center bg-[#1A1F2C] border-b border-blue-900/20`}
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
              <th className="w-[40px]" /> {/* Arrow column */}
            </tr>
          </thead>
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

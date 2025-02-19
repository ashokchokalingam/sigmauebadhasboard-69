
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
      <div className="h-[800px] overflow-auto">
        <table className="w-full border-collapse [&_tr:hover]:bg-blue-950/30 [&_tr]:border-b [&_tr]:border-blue-900/10">
          <colgroup>
            <col className="w-[180px]" /> {/* Time */}
            <col className="w-[140px]" /> {/* User Origin */}
            <col className="w-[140px]" /> {/* User Impacted */}
            <col className="w-[160px]" /> {/* Computer */}
            <col className="w-[200px]" /> {/* Title */}
            <col className="w-[400px]" /> {/* Description */}
            <col className="w-[120px]" /> {/* ML Cluster */}
            <col className="w-[100px]" /> {/* Risk */}
            <col className="w-[40px]" /> {/* Arrow */}
          </colgroup>
          <thead className="sticky top-0 bg-[#0A0D14] z-50">
            <tr>
              {visibleColumns.map((columnKey) => (
                <th 
                  key={columnKey}
                  className="px-4 py-2 text-left bg-[#1A1F2C] border-b border-blue-900/20"
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

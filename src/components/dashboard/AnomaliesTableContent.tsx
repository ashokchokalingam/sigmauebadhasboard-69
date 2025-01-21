import { TableBody } from "@/components/ui/table";
import { Alert } from "./types";
import AlertTableRow from "./AlertTableRow";

interface AnomaliesTableContentProps {
  alerts: Alert[];
  selectedAlert: Alert | null;
  onAlertSelect: (alert: Alert) => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  visibleColumns: string[];
}

const AnomaliesTableContent = ({
  alerts,
  selectedAlert,
  onAlertSelect,
  onTimelineView,
  visibleColumns
}: AnomaliesTableContentProps) => {
  return (
    <TableBody>
      {alerts.map((alert, index) => (
        <AlertTableRow
          key={alert.id}
          alert={alert}
          isSelected={selectedAlert?.id === alert.id}
          onToggle={() => onAlertSelect(alert)}
          onTimelineView={onTimelineView}
          visibleColumns={visibleColumns}
          index={index}
        />
      ))}
    </TableBody>
  );
};

export default AnomaliesTableContent;
import { TableBody } from "@/components/ui/table";
import { Alert } from "./types";
import AlertTableRow from "./AlertTableRow";

interface AnomaliesTableContentProps {
  alerts: Alert[];
  selectedAlert: Alert | null;
  onAlertSelect: (alert: Alert) => void;
  visibleColumns: string[];
}

const AnomaliesTableContent = ({
  alerts,
  selectedAlert,
  onAlertSelect,
  visibleColumns
}: AnomaliesTableContentProps) => {
  return (
    <TableBody>
      {alerts.map((alert) => (
        <AlertTableRow
          key={alert.id}
          alert={alert}
          isSelected={selectedAlert?.id === alert.id}
          onToggle={() => onAlertSelect(alert)}
          onTimelineView={() => {}}
          visibleColumns={visibleColumns}
        />
      ))}
    </TableBody>
  );
};

export default AnomaliesTableContent;

import { TableCell, TableRow } from "@/components/ui/table";
import { Alert } from "./types";
import TimeCell from "./TableCells/TimeCell";
import UserOriginCell from "./TableCells/UserOriginCell";
import UserImpactedCell from "./TableCells/UserImpactedCell";
import ComputerCell from "./TableCells/ComputerCell";
import TitleCell from "./TableCells/TitleCell";
import DescriptionCell from "./TableCells/DescriptionCell";
import { ChevronRight } from "lucide-react";

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
  const getCellComponent = (alert: Alert, columnKey: string) => {
    switch (columnKey) {
      case 'system_time':
        return <TimeCell time={alert.system_time} />;
      case 'user_id':
        return <UserOriginCell userId={alert.user_id} onTimelineView={onTimelineView} />;
      case 'target_user_name':
        return <UserImpactedCell userName={alert.target_user_name} />;
      case 'computer_name':
        return <ComputerCell computerName={alert.computer_name} onTimelineView={onTimelineView} />;
      case 'title':
        return <TitleCell title={alert.title} />;
      case 'description':
        return <DescriptionCell description={alert.description} />;
      case 'ml_cluster':
        return (
          <TableCell className="px-4 py-2">
            <span className="text-[14px] font-medium text-slate-200/90">
              {alert.ml_cluster || '-'}
            </span>
          </TableCell>
        );
      case 'risk':
        return (
          <TableCell className="px-4 py-2">
            <span className="text-[14px] font-medium text-slate-200/90">
              {alert.risk || '-'}
            </span>
          </TableCell>
        );
      default:
        return (
          <TableCell className="px-4 py-2">
            <span className="text-[14px] font-medium text-slate-200/90">
              {String(alert[columnKey as keyof Alert] || '-')}
            </span>
          </TableCell>
        );
    }
  };

  return (
    <>
      {alerts.map((alert) => (
        <TableRow
          key={alert.id}
          className={`hover:bg-blue-950/30 cursor-pointer ${
            selectedAlert?.id === alert.id ? 'bg-blue-950/50' : ''
          }`}
          onClick={() => onAlertSelect(alert)}
        >
          {visibleColumns.map((columnKey) => (
            <td key={columnKey} className="p-0">
              {getCellComponent(alert, columnKey)}
            </td>
          ))}
          <TableCell className="w-[40px] text-center">
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default AnomaliesTableContent;

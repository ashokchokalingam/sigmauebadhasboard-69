import { TableRow } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Alert } from "./types";
import UserOriginCell from "./TableCells/UserOriginCell";
import UserImpactedCell from "./TableCells/UserImpactedCell";
import ComputerCell from "./TableCells/ComputerCell";
import TimeCell from "./TableCells/TimeCell";
import TitleCell from "./TableCells/TitleCell";
import DescriptionCell from "./TableCells/DescriptionCell";
import RiskScoreCell from "./TableCells/RiskScoreCell";
import BasicCell from "./TableCells/BasicCell";

interface AlertTableRowProps {
  alert: Alert;
  isSelected: boolean;
  onToggle: () => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  visibleColumns: string[];
}

const AlertTableRow = ({ 
  alert, 
  isSelected, 
  onToggle, 
  onTimelineView,
  visibleColumns 
}: AlertTableRowProps) => {
  const renderCell = (columnKey: string) => {
    switch (columnKey) {
      case "system_time":
        return <TimeCell time={alert.system_time} />;
      case "user_origin":
        return (
          <UserOriginCell 
            userId={alert.user_id || ''} 
            onTimelineView={onTimelineView} 
          />
        );
      case "user_impacted":
        return (
          <UserImpactedCell 
            userName={alert.target_user_name || ''} 
          />
        );
      case "computer_name":
        return (
          <ComputerCell 
            computerName={alert.computer_name || ''} 
            onTimelineView={onTimelineView} 
          />
        );
      case "title":
        return <TitleCell title={alert.title || ''} />;
      case "description":
        return <DescriptionCell description={alert.description || ''} />;
      case "event_id":
        return <BasicCell value={alert.event_id || 'N/A'} />;
      case "provider_name":
        return <BasicCell value={alert.provider_name || 'N/A'} />;
      case "ml_cluster":
        return <BasicCell value={alert.ml_cluster === null ? 'N/A' : `${alert.ml_cluster}`} />;
      case "ip_address":
        return <BasicCell value={alert.ip_address || 'N/A'} />;
      case "risk":
        return <RiskScoreCell risk={alert.risk} />;
      default:
        const value = alert[columnKey as keyof Alert];
        return <BasicCell value={value !== undefined ? String(value) : 'N/A'} />;
    }
  };
  
  return (
    <TableRow 
      className={`hover:bg-slate-900/30 cursor-pointer ${isSelected ? 'bg-slate-900/20' : ''}`}
      onClick={onToggle}
    >
      {visibleColumns.map((columnKey) => (
        <React.Fragment key={columnKey}>
          {renderCell(columnKey)}
        </React.Fragment>
      ))}
      <BasicCell
        value={
          <ChevronRight 
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isSelected ? 'rotate-90' : ''
            }`}
          />
        }
      />
    </TableRow>
  );
};

export default AlertTableRow;
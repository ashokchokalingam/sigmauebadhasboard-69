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
  const renderCell = (key: string) => {
    if (!visibleColumns.includes(key)) return null;

    switch (key) {
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
      case "risk":
        return <RiskScoreCell risk={alert.risk} />;
      case "ml_cluster":
        return (
          <BasicCell 
            value={alert.ml_cluster === null ? 'N/A' : `Cluster ${alert.ml_cluster}`}
            className="text-slate-200 font-mono"
          />
        );
      default:
        return <BasicCell value={alert[key as keyof Alert]} />;
    }
  };
  
  return (
    <TableRow 
      className={`hover:bg-slate-900/30 cursor-pointer ${isSelected ? 'bg-slate-900/20' : ''}`}
      onClick={onToggle}
    >
      {visibleColumns.map(columnKey => renderCell(columnKey))}
      <BasicCell
        value={
          <button 
            className="p-2 hover:bg-slate-800/50 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <ChevronRight 
              className={`h-4 w-4 text-slate-400 transition-transform ${
                isSelected ? 'rotate-90' : ''
              }`} 
            />
          </button>
        }
      />
    </TableRow>
  );
};

export default AlertTableRow;
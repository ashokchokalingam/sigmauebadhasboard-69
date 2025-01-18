import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Alert } from "./types";
import UserOriginCell from "./TableCells/UserOriginCell";
import UserImpactedCell from "./TableCells/UserImpactedCell";
import ComputerCell from "./TableCells/ComputerCell";
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
  const browserTime = new Date(alert.system_time).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getRiskColor = (risk: number | null) => {
    if (risk === null) return "text-gray-400";
    if (risk >= 80) return "text-red-400";
    if (risk >= 60) return "text-orange-400";
    if (risk >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  const renderCell = (key: string) => {
    if (!visibleColumns.includes(key)) return null;

    switch (key) {
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
        return (
          <TableCell className="px-6 min-w-[300px]">
            <div className="flex flex-col gap-1">
              <span className="text-blue-100 font-medium line-clamp-2">
                {alert.title || 'N/A'}
              </span>
            </div>
          </TableCell>
        );
      case "description":
        return (
          <BasicCell 
            value={alert.description} 
            className="text-blue-300/70 text-sm line-clamp-2" 
          />
        );
      case "system_time":
        return (
          <BasicCell 
            value={browserTime} 
            className="font-mono text-blue-300 text-sm whitespace-nowrap" 
          />
        );
      case "event_id":
      case "provider_name":
      case "ruleid":
      case "rule_level":
      case "task":
      case "target_domain_name":
      case "ip_address":
        return <BasicCell value={alert[key]} />;
      default:
        return <BasicCell value="N/A" />;
    }
  };
  
  return (
    <TableRow 
      className={`hover:bg-slate-900/30 cursor-pointer ${isSelected ? 'bg-slate-900/20' : ''}`}
      onClick={onToggle}
    >
      {visibleColumns.map(columnKey => renderCell(columnKey))}
      <TableCell className="px-6">
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
      </TableCell>
    </TableRow>
  );
};

export default AlertTableRow;
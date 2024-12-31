import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";
import { defaultColumns } from "./TableConfig";
import AlertDetailsView from "./AlertDetailsView";

interface AlertTableRowProps {
  alert: Alert;
  isSelected: boolean;
  onToggle: () => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  visibleColumns: string[];
}

const AlertTableRow = ({ alert, isSelected, onToggle, onTimelineView, visibleColumns }: AlertTableRowProps) => {
  const { tactics } = extractTacticsAndTechniques(alert.tags);
  
  const browserTime = new Date(alert.system_time).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  const renderCell = (key: string) => {
    if (!visibleColumns.includes(key)) return null;

    switch (key) {
      case "title":
        return (
          <TableCell>
            <div className="flex flex-col gap-1">
              <span className="text-blue-100 font-medium line-clamp-2">{alert.title || 'N/A'}</span>
            </div>
          </TableCell>
        );
      case "tags":
        return (
          <TableCell>
            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20 line-clamp-1">
              {tactics || 'N/A'}
            </span>
          </TableCell>
        );
      case "description":
        return (
          <TableCell>
            <span className="text-blue-300/70 text-sm line-clamp-2">
              {alert.description || 'N/A'}
            </span>
          </TableCell>
        );
      case "system_time":
        return (
          <TableCell className="font-mono text-blue-300 text-sm whitespace-nowrap">
            {browserTime}
          </TableCell>
        );
      case "computer_name":
        return (
          <TableCell 
            className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("computer", alert.computer_name);
            }}
          >
            {alert.computer_name || 'N/A'}
          </TableCell>
        );
      case "user_id":
        return (
          <TableCell 
            className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("user", alert.user_id);
            }}
          >
            {alert.user_id || 'N/A'}
          </TableCell>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      <TableRow 
        className={`hover:bg-blue-950/30 cursor-pointer ${isSelected ? 'bg-blue-950/20' : ''}`}
      >
        {defaultColumns.map(column => renderCell(column.key))}
        <TableCell>
          <button 
            className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
            onClick={onToggle}
          >
            {isSelected ? (
              <ChevronDown className="h-4 w-4 text-blue-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-blue-400" />
            )}
          </button>
        </TableCell>
      </TableRow>
      {isSelected && (
        <tr>
          <td colSpan={visibleColumns.length + 1} className="bg-blue-950/10 border-t border-blue-500/10">
            <AlertDetailsView alert={alert} />
          </td>
        </tr>
      )}
    </>
  );
};

export default AlertTableRow;
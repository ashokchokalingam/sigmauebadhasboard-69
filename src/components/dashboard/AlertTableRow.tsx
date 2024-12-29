import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques, getRiskScore, getRiskColor } from "./utils";

interface AlertTableRowProps {
  alert: Alert;
  isSelected: boolean;
  onToggle: () => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const AlertTableRow = ({ alert, isSelected, onToggle, onTimelineView }: AlertTableRowProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  
  return (
    <TableRow className="hover:bg-blue-950/30">
      <TableCell className="font-mono text-blue-300 text-sm whitespace-nowrap">
        {new Date(alert.system_time).toLocaleTimeString()}
      </TableCell>
      <TableCell 
        className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
        onClick={() => onTimelineView("user", alert.user_id)}
      >
        {alert.user_id}
      </TableCell>
      <TableCell 
        className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
        onClick={() => onTimelineView("computer", alert.computer_name)}
      >
        {alert.computer_name}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          <span className="text-blue-100">{alert.title}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
          {tactics || 'N/A'}
        </span>
      </TableCell>
      <TableCell>
        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20">
          {techniques || 'N/A'}
        </span>
      </TableCell>
      <TableCell className={`font-mono font-bold ${getRiskColor(getRiskScore(alert))}`}>
        {getRiskScore(alert).toFixed(1)}
      </TableCell>
      <TableCell>
        {alert.dbscan_cluster === -1 && (
          <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">
            DBSCAN -1
          </span>
        )}
      </TableCell>
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
  );
};

export default AlertTableRow;
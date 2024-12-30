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
  
  // Convert UTC to local browser time
  const utcDate = new Date(alert.system_time);
  const localTime = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
    .toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  
  return (
    <TableRow className="hover:bg-blue-950/30">
      <TableCell className="font-mono text-blue-300 text-sm whitespace-nowrap">
        {localTime}
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
      <TableCell className="text-blue-100 font-mono">
        {alert.ip_address || 'N/A'}
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
        <div className="flex flex-col gap-1">
          {techniques.length > 0 ? (
            techniques.map((technique, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20"
              >
                {technique}
              </span>
            ))
          ) : (
            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20">
              N/A
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className={`font-mono font-bold ${getRiskColor(getRiskScore(alert))}`}>
        {getRiskScore(alert).toFixed(1)}
      </TableCell>
      <TableCell>
        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
          {alert.dbscan_cluster}
        </span>
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
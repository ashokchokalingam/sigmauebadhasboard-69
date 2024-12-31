import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques, getRiskScore, getRiskColor } from "./utils";

interface AlertTableRowProps {
  alert: Alert;
  isSelected: boolean;
  onToggle: () => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  visibleColumns: string[];
}

const AlertTableRow = ({ alert, isSelected, onToggle, onTimelineView, visibleColumns }: AlertTableRowProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  
  // Convert to browser's local time
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
      case "system_time":
        return (
          <TableCell className="font-mono text-blue-300 text-sm whitespace-nowrap">
            {browserTime}
          </TableCell>
        );
      case "user_id":
        return (
          <TableCell 
            className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => onTimelineView("user", alert.user_id)}
          >
            {alert.user_id}
          </TableCell>
        );
      case "computer_name":
        return (
          <TableCell 
            className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => onTimelineView("computer", alert.computer_name)}
          >
            {alert.computer_name}
          </TableCell>
        );
      case "ip_address":
        return (
          <TableCell className="text-blue-100 font-mono">
            {alert.ip_address || 'N/A'}
          </TableCell>
        );
      case "title":
        return (
          <TableCell>
            <div className="flex flex-col gap-1">
              <span className="text-blue-100 font-medium">{alert.title}</span>
              {alert.description && (
                <span className="text-blue-300/70 text-sm line-clamp-2">
                  {alert.description}
                </span>
              )}
            </div>
          </TableCell>
        );
      case "tags":
        return (
          <TableCell>
            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
              {tactics || 'N/A'}
            </span>
          </TableCell>
        );
      case "techniques":
        return (
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
        );
      case "risk_score":
        return (
          <TableCell className={`font-mono font-bold ${getRiskColor(getRiskScore(alert))}`}>
            {getRiskScore(alert).toFixed(1)}
          </TableCell>
        );
      case "dbscan_cluster":
        return (
          <TableCell>
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
              {alert.dbscan_cluster}
            </span>
          </TableCell>
        );
      default:
        return null;
    }
  };
  
  return (
    <TableRow className="hover:bg-blue-950/30">
      {["system_time", "user_id", "computer_name", "ip_address", "title", "tags", "techniques", "risk_score", "dbscan_cluster"].map(key => 
        renderCell(key)
      )}
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
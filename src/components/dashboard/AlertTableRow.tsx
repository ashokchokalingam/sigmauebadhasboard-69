import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";

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
      case "users":
        return (
          <TableCell>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-blue-400">User Origin</span>
                <p 
                  className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTimelineView("user", alert.user_id || '');
                  }}
                >
                  {alert.user_id || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-xs text-blue-400">User Impacted</span>
                <p className="text-blue-100 whitespace-nowrap">
                  {alert.target_user_name || 'N/A'}
                </p>
              </div>
            </div>
          </TableCell>
        );
      case "title":
        return (
          <TableCell>
            <div className="flex flex-col gap-1">
              <span className="text-blue-100 font-medium line-clamp-2">{alert.title || 'N/A'}</span>
            </div>
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
          <TableCell className="min-w-[180px] font-mono text-blue-300 text-sm whitespace-nowrap">
            {browserTime}
          </TableCell>
        );
      case "computer_name":
        return (
          <TableCell 
            className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("computer", alert.computer_name || '');
            }}
          >
            {alert.computer_name || 'N/A'}
          </TableCell>
        );
      case "event_id":
        return (
          <TableCell className="text-blue-100 whitespace-nowrap">
            {alert.event_id || 'N/A'}
          </TableCell>
        );
      case "provider_name":
        return (
          <TableCell className="text-blue-100 whitespace-nowrap">
            {alert.provider_name || 'N/A'}
          </TableCell>
        );
      case "ml_cluster":
        return (
          <TableCell>
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
              {alert.ml_cluster === null ? 'N/A' : `Cluster ${alert.ml_cluster}`}
            </span>
          </TableCell>
        );
      case "ip_address":
        return (
          <TableCell className="text-blue-100 font-mono whitespace-nowrap">
            {alert.ip_address || 'N/A'}
          </TableCell>
        );
      case "ruleid":
        return (
          <TableCell className="text-blue-100 whitespace-nowrap">
            {alert.ruleid || 'N/A'}
          </TableCell>
        );
      case "rule_level":
        return (
          <TableCell className="text-blue-100 whitespace-nowrap capitalize">
            {alert.rule_level || 'N/A'}
          </TableCell>
        );
      case "task":
        return (
          <TableCell className="text-blue-100 whitespace-nowrap capitalize">
            {alert.task || 'N/A'}
          </TableCell>
        );
      case "target_domain_name":
        return (
          <TableCell className="text-blue-100 whitespace-nowrap">
            {alert.target_domain_name || 'N/A'}
          </TableCell>
        );
      case "tactics":
        return (
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {alert.tactics?.split(',').map((tactic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20"
                >
                  {tactic.trim()}
                </span>
              ))}
            </div>
          </TableCell>
        );
      case "techniques":
        return (
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {alert.techniques?.split(',').map((technique, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20"
                >
                  {technique.trim()}
                </span>
              ))}
            </div>
          </TableCell>
        );
      case "ml_description":
        return (
          <TableCell>
            <span className="text-blue-300/70 text-sm line-clamp-2">
              {alert.ml_description || 'N/A'}
            </span>
          </TableCell>
        );
      case "risk":
        return (
          <TableCell>
            <span className={`font-medium ${getRiskColor(alert.risk)}`}>
              {alert.risk === null ? 'N/A' : `${alert.risk}%`}
            </span>
          </TableCell>
        );
      case "tags":
        return (
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {alert.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </TableCell>
        );
      case "raw":
        return (
          <TableCell>
            <div className="max-w-md overflow-hidden">
              <pre className="text-xs text-blue-300/70 whitespace-pre-wrap break-all">
                {typeof alert.raw === 'string' ? alert.raw : JSON.stringify(alert.raw, null, 2)}
              </pre>
            </div>
          </TableCell>
        );
      default:
        return (
          <TableCell className="text-blue-100">
            N/A
          </TableCell>
        );
    }
  };
  
  return (
    <TableRow 
      className={`hover:bg-blue-950/30 cursor-pointer ${isSelected ? 'bg-blue-950/20' : ''}`}
      onClick={onToggle}
    >
      {visibleColumns.map(columnKey => renderCell(columnKey))}
      <TableCell>
        <button 
          className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <ChevronRight className={`h-4 w-4 text-blue-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
        </button>
      </TableCell>
    </TableRow>
  );
};

export default AlertTableRow;

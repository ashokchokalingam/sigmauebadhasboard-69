import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight, User, Shield } from "lucide-react";
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
      case "user_origin":
        return (
          <TableCell className="min-w-[200px] px-6">
            <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/10 hover:bg-blue-950/40 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <User className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs font-medium text-blue-400">User Origin</span>
              </div>
              <p 
                className="text-sm font-mono text-blue-100 hover:text-blue-400 transition-colors cursor-pointer pl-5"
                onClick={(e) => {
                  e.stopPropagation();
                  onTimelineView("user", alert.user_id || '');
                }}
              >
                {alert.user_id || 'N/A'}
              </p>
            </div>
          </TableCell>
        );
      case "user_impacted":
        return (
          <TableCell className="min-w-[200px] px-6">
            <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/10 hover:bg-purple-950/40 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs font-medium text-purple-400">User Impacted</span>
              </div>
              <p className="text-sm font-mono text-purple-100 pl-5">
                {alert.target_user_name || 'N/A'}
              </p>
            </div>
          </TableCell>
        );
      case "title":
        return (
          <TableCell className="px-6 min-w-[300px]">
            <div className="flex flex-col gap-1">
              <span className="text-blue-100 font-medium line-clamp-2">{alert.title || 'N/A'}</span>
            </div>
          </TableCell>
        );
      case "description":
        return (
          <TableCell className="px-6 min-w-[400px]">
            <span className="text-blue-300/70 text-sm line-clamp-2">
              {alert.description || 'N/A'}
            </span>
          </TableCell>
        );
      case "system_time":
        return (
          <TableCell className="px-6 min-w-[180px] font-mono text-blue-300 text-sm whitespace-nowrap">
            {browserTime}
          </TableCell>
        );
      case "computer_name":
        return (
          <TableCell 
            className="px-6 min-w-[200px] text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors font-mono"
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
          <TableCell className="px-6 text-blue-100 whitespace-nowrap">
            {alert.event_id || 'N/A'}
          </TableCell>
        );
      case "provider_name":
        return (
          <TableCell className="px-6 text-blue-100 whitespace-nowrap">
            {alert.provider_name || 'N/A'}
          </TableCell>
        );
      case "ml_cluster":
        return (
          <TableCell className="px-6">
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
              {alert.ml_cluster === null ? 'N/A' : `Cluster ${alert.ml_cluster}`}
            </span>
          </TableCell>
        );
      case "ip_address":
        return (
          <TableCell className="px-6 text-blue-100 font-mono whitespace-nowrap">
            {alert.ip_address || 'N/A'}
          </TableCell>
        );
      case "ruleid":
        return (
          <TableCell className="px-6 text-blue-100 whitespace-nowrap">
            {alert.ruleid || 'N/A'}
          </TableCell>
        );
      case "rule_level":
        return (
          <TableCell className="px-6 text-blue-100 whitespace-nowrap capitalize">
            {alert.rule_level || 'N/A'}
          </TableCell>
        );
      case "task":
        return (
          <TableCell className="px-6 text-blue-100 whitespace-nowrap capitalize">
            {alert.task || 'N/A'}
          </TableCell>
        );
      case "target_domain_name":
        return (
          <TableCell className="px-6 text-blue-100 whitespace-nowrap">
            {alert.target_domain_name || 'N/A'}
          </TableCell>
        );
      case "tactics":
        return (
          <TableCell className="px-6">
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
          <TableCell className="px-6">
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
          <TableCell className="px-6">
            <span className="text-blue-300/70 text-sm line-clamp-2">
              {alert.ml_description || 'N/A'}
            </span>
          </TableCell>
        );
      case "risk":
        return (
          <TableCell className="px-6">
            <span className={`font-medium ${getRiskColor(alert.risk)}`}>
              {alert.risk === null ? 'N/A' : `${alert.risk}%`}
            </span>
          </TableCell>
        );
      case "tags":
        return (
          <TableCell className="px-6">
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
          <TableCell className="px-6">
            <div className="max-w-md overflow-hidden">
              <pre className="text-xs text-blue-300/70 whitespace-pre-wrap break-all">
                {typeof alert.raw === 'string' ? alert.raw : JSON.stringify(alert.raw, null, 2)}
              </pre>
            </div>
          </TableCell>
        );
      default:
        return (
          <TableCell className="px-6 text-blue-100">
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
      <TableCell className="px-6">
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

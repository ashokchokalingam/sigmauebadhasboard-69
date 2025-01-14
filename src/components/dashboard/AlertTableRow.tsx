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

  const renderRiskScore = (risk: number | null) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk)} bg-blue-500/10`}>
        {risk === null ? 'N/A' : `${risk}%`}
      </span>
    );
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
                <div className="flex items-center gap-2">
                  <p 
                    className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTimelineView("user", alert.user_id || '');
                    }}
                  >
                    {alert.user_id || 'N/A'}
                  </p>
                  {renderRiskScore(alert.risk)}
                </div>
              </div>
              <div>
                <span className="text-xs text-blue-400">User Impacted</span>
                <div className="flex items-center gap-2">
                  <p className="text-blue-100 whitespace-nowrap">
                    {alert.target_user_name || 'N/A'}
                  </p>
                  {renderRiskScore(alert.risk)}
                </div>
              </div>
            </div>
          </TableCell>
        );
      case "computer_name":
        return (
          <TableCell>
            <div className="flex items-center gap-2">
              <p 
                className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onTimelineView("computer", alert.computer_name || '');
                }}
              >
                {alert.computer_name || 'N/A'}
              </p>
              {renderRiskScore(alert.risk)}
            </div>
          </TableCell>
        );
      case "title":
        return (
          <TableCell>
            <span className="text-blue-100 font-medium">{alert.title}</span>
          </TableCell>
        );
      case "description":
        return (
          <TableCell>
            <span className="text-blue-300/70 text-sm line-clamp-1">
              {alert.description}
            </span>
          </TableCell>
        );
      case "system_time":
        return (
          <TableCell className="min-w-[180px] font-mono text-blue-300 text-sm whitespace-nowrap">
            {browserTime}
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
      case "tags":
        return (
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {alert.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
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

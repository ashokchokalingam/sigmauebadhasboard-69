import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight, Loader } from "lucide-react";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";
import { useState } from "react";

interface AlertTableRowProps {
  alert: Alert;
  isSelected: boolean;
  onToggle: () => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  visibleColumns: string[];
}

const AlertTableRow = ({ alert, isSelected, onToggle, onTimelineView, visibleColumns }: AlertTableRowProps) => {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      onToggle();
    } finally {
      setIsLoading(false);
    }
  };

  const renderCell = (key: string) => {
    if (!visibleColumns.includes(key)) return null;

    switch (key) {
      case "users":
        return (
          <TableCell className="px-4 py-2">
            <div className="space-y-1">
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
          <TableCell className="px-4 py-2">
            <div className="flex flex-col gap-1">
              <span className="text-blue-100 font-medium line-clamp-2">{alert.title || 'N/A'}</span>
            </div>
          </TableCell>
        );
      case "description":
        return (
          <TableCell className="px-4 py-2">
            <span className="text-blue-300/70 text-sm line-clamp-2">
              {alert.description || 'N/A'}
            </span>
          </TableCell>
        );
      case "system_time":
        return (
          <TableCell className="px-4 py-2 min-w-[180px] font-mono text-blue-300 text-sm whitespace-nowrap">
            {browserTime}
          </TableCell>
        );
      case "computer_name":
        return (
          <TableCell 
            className="px-4 py-2 text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("computer", alert.computer_name || '');
            }}
          >
            {alert.computer_name || 'N/A'}
          </TableCell>
        );
      default:
        return (
          <TableCell className="px-4 py-2 text-blue-100">
            N/A
          </TableCell>
        );
    }
  };
  
  return (
    <TableRow 
      className={`hover:bg-blue-950/30 cursor-pointer border-b border-blue-500/10 ${isSelected ? 'bg-blue-950/20' : ''}`}
      onClick={onToggle}
    >
      {visibleColumns.map(columnKey => renderCell(columnKey))}
      <TableCell className="px-4 py-2">
        <button 
          className="p-2 hover:bg-blue-500/10 rounded-full transition-colors disabled:opacity-50"
          onClick={onToggle}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="h-4 w-4 text-blue-400 animate-spin" />
          ) : (
            <ChevronRight className={`h-4 w-4 text-blue-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
          )}
        </button>
      </TableCell>
    </TableRow>
  );
};

export default AlertTableRow;
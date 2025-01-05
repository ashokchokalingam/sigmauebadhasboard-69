import { TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Alert } from "./types";

interface TableRowProps {
  alert: Alert;
  visibleColumns: string[];
  onToggleRaw: (alertId: string, event: React.MouseEvent) => void;
}

const TableRow = ({ alert, visibleColumns, onToggleRaw }: TableRowProps) => {
  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", {
    hour: "numeric",
    minute: "numeric",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formatRawData = (raw: any): string => {
    if (raw === null || raw === undefined) return 'N/A';
    if (typeof raw === 'string') return raw;
    try {
      return JSON.stringify(raw, null, 2);
    } catch {
      return 'Invalid Data';
    }
  };

  const renderCell = (key: string) => {
    if (!visibleColumns.includes(key)) return null;

    switch (key) {
      case "system_time":
        return (
          <TableCell>
            <div className="flex flex-col">
              <span className="text-blue-100">{formatDate(alert.system_time)}</span>
              <span className="text-xs text-blue-300/70">
                {formatDistanceToNow(new Date(alert.system_time), { addSuffix: true })}
              </span>
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
      case "user_id":
        return (
          <TableCell>
            <span className="text-blue-100">{alert.user_id}</span>
          </TableCell>
        );
      case "target_user_name":
        return (
          <TableCell>
            <span className="text-blue-100">{alert.target_user_name}</span>
          </TableCell>
        );
      case "computer_name":
        return (
          <TableCell>
            <span className="text-blue-100">{alert.computer_name}</span>
          </TableCell>
        );
      case "severity":
        return (
          <TableCell>
            <span className="text-blue-100">{alert.severity}</span>
          </TableCell>
        );
      case "tags":
        return (
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {alert.tags.split(",").map((tag, index) => (
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
      case "dbscan_cluster":
        return (
          <TableCell>
            <span className="text-blue-100">
              {alert.dbscan_cluster === -1 ? "Noise" : `Cluster ${alert.dbscan_cluster}`}
            </span>
          </TableCell>
        );
      case "raw":
        return (
          <TableCell>
            <span className="text-blue-300/70 text-sm line-clamp-1">
              {formatRawData(alert.raw)}
            </span>
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
    <>
      {visibleColumns.map((column) => renderCell(column))}
    </>
  );
};

export default TableRow;
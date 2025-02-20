
import { Alert } from "../types";
import TableCell from "./TableCell";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";

interface TableRowProps {
  alert: Alert;
  index: number;
  columnOrder: string[];
  getColumnWidth: (key: string) => string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  onAlertSelect: (alert: Alert) => void;
}

const TableRow = ({ 
  alert, 
  index, 
  columnOrder, 
  getColumnWidth,
  onTimelineView,
  onAlertSelect 
}: TableRowProps) => {
  return (
    <div
      className={`grid cursor-pointer border-b border-slate-800/50 ${
        index % 2 === 0 ? 'bg-slate-950/20' : ''
      } hover:bg-slate-800/20 min-h-[64px]`}
      style={{ 
        gridTemplateColumns: columnOrder.map(col => getColumnWidth(col)).join(' ')
      }}
      onClick={() => onAlertSelect(alert)}
    >
      {columnOrder.map((columnKey) => (
        <div key={columnKey} className="px-4 py-3 text-sm text-slate-300 flex items-center">
          <TableCell 
            alert={alert}
            columnKey={columnKey}
            onTimelineView={onTimelineView}
          />
        </div>
      ))}
    </div>
  );
};

export default TableRow;

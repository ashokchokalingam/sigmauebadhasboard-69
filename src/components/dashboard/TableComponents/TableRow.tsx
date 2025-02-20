
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
      className={`grid cursor-pointer border-b ${
        index % 2 === 0 ? 'bg-slate-950/20' : ''
      } hover:bg-slate-800/20 min-h-[68px] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-slate-700/20`}
      style={{ 
        gridTemplateColumns: columnOrder.map(col => getColumnWidth(col)).join(' ')
      }}
      onClick={() => onAlertSelect(alert)}
    >
      {columnOrder.map((columnKey) => (
        <div key={columnKey} className="px-4 py-3.5 text-sm text-slate-300 flex items-center">
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

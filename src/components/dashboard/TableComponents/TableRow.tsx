
import { Alert } from "../types";
import TableCell from "./TableCell";

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
      className={`grid cursor-pointer ${
        index % 2 === 0 ? 'bg-slate-950/20' : ''
      } hover:bg-slate-800/20`}
      style={{ 
        gridTemplateColumns: columnOrder.map(col => getColumnWidth(col)).join(' ')
      }}
      onClick={() => onAlertSelect(alert)}
    >
      {columnOrder.map((columnKey) => (
        <div key={columnKey} className="px-3 py-2.5 text-sm text-slate-300">
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

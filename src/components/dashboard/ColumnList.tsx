import { DropdownMenuCheckboxItem } from "../ui/dropdown-menu";
import { Column } from "./types";

interface ColumnListProps {
  columns: Column[];
  visibleColumns: string[];
  onColumnToggle: (columnKey: string, checked: boolean, e?: React.MouseEvent) => void;
}

const ColumnList = ({ columns, visibleColumns, onColumnToggle }: ColumnListProps) => {
  return (
    <div className="max-h-[300px] overflow-y-auto">
      {columns.map((column) => (
        <DropdownMenuCheckboxItem
          key={column.key}
          className="text-blue-300 hover:text-blue-400 hover:bg-blue-950/50 cursor-pointer"
          checked={visibleColumns.includes(column.key)}
          onCheckedChange={(checked) => onColumnToggle(column.key, checked)}
          onSelect={(e) => e.preventDefault()}
        >
          {column.label}
        </DropdownMenuCheckboxItem>
      ))}
    </div>
  );
};

export default ColumnList;
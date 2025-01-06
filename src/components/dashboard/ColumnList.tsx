import { DropdownMenuCheckboxItem } from "../ui/dropdown-menu";
import { allColumns } from "./TableConfig";

interface ColumnListProps {
  pendingColumns: string[];
  onColumnToggle: (columnKey: string, checked: boolean, e?: React.MouseEvent) => void;
}

const ColumnList = ({ pendingColumns, onColumnToggle }: ColumnListProps) => {
  return (
    <div className="max-h-[300px] overflow-y-auto">
      {allColumns.map((column) => (
        <DropdownMenuCheckboxItem
          key={column.key}
          className="text-blue-300 hover:text-blue-400 hover:bg-blue-950/50 cursor-pointer"
          checked={pendingColumns.includes(column.key)}
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
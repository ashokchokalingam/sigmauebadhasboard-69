import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

interface Column {
  label: string;
  key: string;
}

interface ColumnSelectorProps {
  columns: Column[];
  visibleColumns: string[];
  onColumnToggle: (column: string) => void;
}

const ColumnSelector = ({ columns, visibleColumns, onColumnToggle }: ColumnSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
          <Settings2 className="mr-2 h-4 w-4" />
          <span>Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] bg-slate-900 border border-blue-500/20">
        <DropdownMenuLabel className="text-blue-400">Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-500/20" />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            className="text-blue-300 hover:text-blue-400 hover:bg-blue-950/50 cursor-pointer"
            checked={visibleColumns.includes(column.key)}
            onCheckedChange={() => onColumnToggle(column.key)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnSelector;
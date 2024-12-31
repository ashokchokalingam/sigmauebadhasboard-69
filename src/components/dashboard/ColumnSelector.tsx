import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface Column {
  label: string;
  key: string;
}

interface ColumnSelectorProps {
  columns: Column[];
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
}

const ColumnSelector = ({ columns, visibleColumns, onColumnToggle }: ColumnSelectorProps) => {
  const { toast } = useToast();

  const handleSelectAll = () => {
    const allColumnKeys = columns.map(col => col.key);
    onColumnToggle(allColumnKeys);
    toast({
      title: "All Columns Shown",
      description: "All columns have been enabled",
    });
  };

  const handleClearAll = () => {
    // Keep at least one column visible (Time)
    onColumnToggle(['system_time']);
    toast({
      title: "Columns Hidden",
      description: "All optional columns have been hidden",
    });
  };

  const handleColumnToggle = (columnKey: string, checked: boolean) => {
    if (checked) {
      onColumnToggle([...visibleColumns, columnKey]);
    } else {
      // Prevent hiding all columns - keep at least one
      if (visibleColumns.length > 1) {
        onColumnToggle(visibleColumns.filter(key => key !== columnKey));
      } else {
        toast({
          title: "Cannot Hide All Columns",
          description: "At least one column must remain visible",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
          <Filter className="mr-2 h-4 w-4" />
          <span>Filter Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] bg-slate-900 border border-blue-500/20">
        <DropdownMenuLabel className="text-blue-400 flex items-center justify-between">
          <span>Toggle Columns</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleSelectAll}
              className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClearAll}
              className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-500/20" />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            className="text-blue-300 hover:text-blue-400 hover:bg-blue-950/50 cursor-pointer"
            checked={visibleColumns.includes(column.key)}
            onCheckedChange={(checked) => handleColumnToggle(column.key, checked)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnSelector;

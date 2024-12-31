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
import { useState } from "react";

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
  const [pendingColumns, setPendingColumns] = useState<string[]>(visibleColumns);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allColumnKeys = columns.map(col => col.key);
    setPendingColumns(allColumnKeys);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Keep at least one column visible (Time)
    setPendingColumns(['system_time']);
  };

  const handleColumnToggle = (columnKey: string, checked: boolean) => {
    if (checked) {
      setPendingColumns(prev => [...prev, columnKey]);
    } else {
      // Prevent hiding all columns - keep at least one
      if (pendingColumns.length > 1) {
        setPendingColumns(prev => prev.filter(key => key !== columnKey));
      } else {
        toast({
          title: "Cannot Hide All Columns",
          description: "At least one column must remain visible",
          variant: "destructive",
        });
      }
    }
  };

  const handleApplyChanges = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onColumnToggle(pendingColumns);
    setIsOpen(false);
    toast({
      title: "Column Changes Applied",
      description: "The selected columns are now visible",
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
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
              size="sm"
              onClick={handleSelectAll}
              className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-500/20" />
        <div className="max-h-[300px] overflow-y-auto">
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.key}
              className="text-blue-300 hover:text-blue-400 hover:bg-blue-950/50 cursor-pointer"
              checked={pendingColumns.includes(column.key)}
              onCheckedChange={(checked) => handleColumnToggle(column.key, checked)}
              onSelect={(e) => e.preventDefault()}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
        <DropdownMenuSeparator className="bg-blue-500/20" />
        <div className="p-2">
          <Button
            onClick={handleApplyChanges}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            Apply Changes
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnSelector;

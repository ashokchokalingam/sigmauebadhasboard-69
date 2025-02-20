import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { allColumns } from "./TableConfig";
import ColumnSelectorActions from "./ColumnSelectorActions";

export interface ColumnSelectorProps {
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const ColumnSelector = ({
  visibleColumns,
  onColumnToggle,
  onSelectAll,
  onDeselectAll
}: ColumnSelectorProps) => {
  const { toast } = useToast();
  const [pendingColumns, setPendingColumns] = useState<string[]>(visibleColumns);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allColumnKeys = allColumns.map(col => col.key);
    setPendingColumns(allColumnKeys);
    onSelectAll();
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingColumns(['system_time']);
    onDeselectAll();
  };

  const handleColumnToggle = (columnKey: string) => {
    let newColumns: string[];
    if (pendingColumns.includes(columnKey)) {
      if (pendingColumns.length === 1 && pendingColumns[0] === columnKey) {
        toast({
          title: "Cannot hide all columns",
          description: "At least one column must remain visible",
          variant: "destructive",
        });
        return;
      }
      newColumns = pendingColumns.filter(key => key !== columnKey);
    } else {
      newColumns = [...pendingColumns, columnKey];
    }
    setPendingColumns(newColumns);
    onColumnToggle(newColumns);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 text-[#33C3F0] border-[#33C3F0]/20 hover:bg-[#33C3F0]/10 hover:border-[#33C3F0]/30 transition-all duration-200 hover:shadow-[0_0_10px_rgba(51,195,240,0.2)] font-medium"
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-4 bg-slate-900 border border-blue-500/20" 
        align="start"
        side="bottom"
      >
        <div className="border-b border-blue-500/10 pb-2 mb-2">
          <ColumnSelectorActions
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {allColumns.map((column) => (
            <div key={column.key} className="flex items-center space-x-2">
              <Checkbox
                id={column.key}
                checked={pendingColumns.includes(column.key)}
                onCheckedChange={() => handleColumnToggle(column.key)}
                className="border-blue-500/20"
              />
              <label
                htmlFor={column.key}
                className="text-sm text-blue-300 cursor-pointer"
              >
                {column.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

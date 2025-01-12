import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { allColumns } from "./TableConfig";
import ColumnList from "./ColumnList";
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

  const handleColumnToggle = (columnKey: string, checked: boolean, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    let newColumns: string[];
    if (checked) {
      newColumns = [...pendingColumns, columnKey];
    } else {
      if (pendingColumns.length === 1 && pendingColumns[0] === columnKey) {
        toast({
          title: "Cannot hide all columns",
          description: "At least one column must remain visible",
          variant: "destructive",
        });
        return;
      }
      newColumns = pendingColumns.filter(key => key !== columnKey);
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
          className="flex items-center gap-2 text-blue-400 border-blue-500/20 hover:bg-blue-500/10"
        >
          <Settings2 className="h-4 w-4" />
          <span>Columns</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[200px] p-0" 
        align="start"
        side="bottom"
      >
        <div className="border-b border-blue-500/10 p-2">
          <ColumnSelectorActions
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />
        </div>
        <ColumnList
          columns={allColumns}
          visibleColumns={pendingColumns}
          onColumnToggle={handleColumnToggle}
        />
      </PopoverContent>
    </Popover>
  );
};
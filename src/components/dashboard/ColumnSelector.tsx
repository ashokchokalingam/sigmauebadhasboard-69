import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { allColumns } from "./TableConfig";
import ColumnSelectorActions from "./ColumnSelectorActions";
import ColumnList from "./ColumnList";

interface ColumnSelectorProps {
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
}

const ColumnSelector = ({ visibleColumns, onColumnToggle }: ColumnSelectorProps) => {
  const { toast } = useToast();
  const [pendingColumns, setPendingColumns] = useState<string[]>(visibleColumns);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allColumnKeys = allColumns.map(col => col.key);
    setPendingColumns(allColumnKeys);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingColumns(['system_time']);
  };

  const handleColumnToggle = (columnKey: string, checked: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (checked) {
      setPendingColumns(prev => [...prev, columnKey]);
    } else {
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

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
        <Button variant="outline" size="sm" className="h-8 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
          <Filter className="mr-2 h-4 w-4" />
          <span>Filter Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[200px] bg-slate-900 border border-blue-500/20"
        onClick={handleDropdownClick}
      >
        <DropdownMenuLabel className="text-blue-400 flex items-center justify-between">
          <span>Toggle Columns</span>
          <ColumnSelectorActions
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-500/20" />
        <ColumnList
          pendingColumns={pendingColumns}
          onColumnToggle={handleColumnToggle}
        />
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
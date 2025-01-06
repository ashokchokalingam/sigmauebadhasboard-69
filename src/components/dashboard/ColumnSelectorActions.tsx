import { Button } from "../ui/button";
import { X } from "lucide-react";

interface ColumnSelectorActionsProps {
  onSelectAll: (e: React.MouseEvent) => void;
  onClearAll: (e: React.MouseEvent) => void;
}

const ColumnSelectorActions = ({ onSelectAll, onClearAll }: ColumnSelectorActionsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onSelectAll}
        className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
      >
        All
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ColumnSelectorActions;
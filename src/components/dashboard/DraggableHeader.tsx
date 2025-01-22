import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableHead } from "../ui/table";
import ColumnFilter from "./ColumnFilter";
import { GripHorizontal } from "lucide-react";
import { Alert } from "./types";

interface DraggableHeaderProps {
  id: string;
  title: string;
  columnKey: string;
  onFilterChange: (column: string, value: string) => void;
  selectedValue: string;
  alerts: Alert[];
}

const DraggableHeader = ({ id, title, columnKey, onFilterChange, selectedValue, alerts }: DraggableHeaderProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const last7DaysAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.system_time);
    return alertDate >= sevenDaysAgo;
  });

  const getUniqueValues = (key: keyof Alert) => {
    const uniqueValues = Array.from(new Set(last7DaysAlerts.map(alert => {
      if (key === 'system_time') {
        return new Date(alert[key]).toLocaleTimeString();
      }
      return String(alert[key]);
    }))).filter(Boolean);
    
    return uniqueValues.sort();
  };

  return (
    <TableHead 
      ref={setNodeRef} 
      style={style} 
      className="text-blue-300 group cursor-move relative"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2">
        <GripHorizontal className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <ColumnFilter
          title={title}
          options={getUniqueValues(columnKey as keyof Alert)}
          onSelect={(value) => onFilterChange(columnKey, value)}
          selectedValue={selectedValue}
        />
      </div>
    </TableHead>
  );
};

export default DraggableHeader;
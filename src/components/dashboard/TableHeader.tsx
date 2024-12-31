import { TableRow } from "@/components/ui/table";
import { Alert } from "./types";
import { defaultColumns } from "./TableConfig";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableHeader from "./DraggableHeader";

interface TableHeaderProps {
  alerts: Alert[];
  onFilterChange: (column: string, value: string) => void;
  filters: Record<string, string>;
  visibleColumns: string[];
  onColumnOrderChange: (newOrder: string[]) => void;
}

const TableHeaderComponent = ({ 
  alerts, 
  onFilterChange, 
  filters, 
  visibleColumns,
  onColumnOrderChange 
}: TableHeaderProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = visibleColumns.indexOf(active.id);
      const newIndex = visibleColumns.indexOf(over.id);
      
      const newOrder = arrayMove(visibleColumns, oldIndex, newIndex);
      onColumnOrderChange(newOrder);
    }
  };

  return (
    <thead>
      <TableRow className="hover:bg-blue-950/30">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleColumns}
            strategy={horizontalListSortingStrategy}
          >
            {defaultColumns.map(column => 
              visibleColumns.includes(column.key) && (
                <DraggableHeader
                  key={column.key}
                  id={column.key}
                  title={column.label}
                  columnKey={column.key}
                  onFilterChange={onFilterChange}
                  selectedValue={filters[column.key]}
                  alerts={alerts}
                />
              )
            )}
          </SortableContext>
        </DndContext>
        <th className="w-[50px]"></th>
      </TableRow>
    </thead>
  );
};

export default TableHeaderComponent;
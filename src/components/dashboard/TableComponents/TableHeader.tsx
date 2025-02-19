
import { GripHorizontal } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableHeaderProps {
  id: string;
  children: React.ReactNode;
}

export const DraggableHeader = ({ id, children }: DraggableHeaderProps) => {
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
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="group">
      <div className="flex items-center gap-2 w-full">
        {children}
        <GripHorizontal 
          className="h-4 w-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" 
          {...listeners}
        />
      </div>
    </div>
  );
};

interface TableHeaderProps {
  columnOrder: string[];
  getColumnWidth: (key: string) => string;
  getColumnLabel: (key: string) => string;
}

const TableHeader = ({ columnOrder, getColumnWidth, getColumnLabel }: TableHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-[#0A0D14] border-b border-slate-800">
      <div className="grid" style={{ 
        gridTemplateColumns: columnOrder.map(col => getColumnWidth(col)).join(' ')
      }}>
        {columnOrder.map((columnKey) => (
          <div 
            key={columnKey}
            className="px-3 py-3 text-sm font-medium text-slate-300"
          >
            <DraggableHeader id={columnKey}>
              {getColumnLabel(columnKey)}
            </DraggableHeader>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableHeader;

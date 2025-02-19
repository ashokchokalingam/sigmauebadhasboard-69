
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Alert } from "./types";
import AlertDetailsView from "./AlertDetailsView";
import { format } from "date-fns";
import { ChevronRight, User, Monitor, FileText, AlignLeft, GripHorizontal } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect } from 'react';

interface AnomaliesTableViewProps {
  alerts: Alert[];
  selectedAlert: Alert | null;
  onFilterChange: (column: string, value: string) => void;
  filters: Record<string, string>;
  visibleColumns: string[];
  onAlertSelect: (alert: Alert) => void;
  onTimelineView: (type: "user" | "computer", id: string) => void;
  filteredAlerts: Alert[];
  onClose: () => void;
}

const DraggableHeader = ({ id, children }: { id: string; children: React.ReactNode }) => {
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
          className="h-3.5 w-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" 
          {...listeners}
        />
      </div>
    </div>
  );
};

const AnomaliesTableView = ({
  alerts,
  selectedAlert,
  onFilterChange,
  filters,
  visibleColumns: initialVisibleColumns,
  onAlertSelect,
  onTimelineView,
  filteredAlerts,
  onClose
}: AnomaliesTableViewProps) => {
  const [columnOrder, setColumnOrder] = useState(initialVisibleColumns);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }
  }));

  useEffect(() => {
    setColumnOrder(initialVisibleColumns);
  }, [initialVisibleColumns]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = columnOrder.indexOf(String(active.id));
    const newIndex = columnOrder.indexOf(String(over.id));
    
    const newOrder = [...columnOrder];
    newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, String(active.id));
    setColumnOrder(newOrder);
  };

  const getColumnWidth = (columnKey: string) => {
    switch (columnKey) {
      case 'system_time': return '180px';
      case 'user_id': return '140px';
      case 'target_user_name': return '140px';
      case 'title': return 'minmax(200px, 1fr)';
      case 'description': return 'minmax(300px, 1.5fr)';
      case 'computer_name': return '140px';
      case 'ml_cluster': return '100px';
      case 'risk': return '100px';
      default: return '140px';
    }
  };

  const TableContent = (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="sticky top-0 z-50 bg-[#0A0D14] border-b border-slate-800">
          <div className="grid" style={{ 
            gridTemplateColumns: columnOrder.map(col => getColumnWidth(col)).join(' ')
          }}>
            <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
              {columnOrder.map((columnKey) => (
                <div 
                  key={columnKey}
                  className="px-2 py-2 text-xs font-medium text-slate-400"
                >
                  <DraggableHeader id={columnKey}>
                    {getColumnLabel(columnKey)}
                  </DraggableHeader>
                </div>
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid">
          {filteredAlerts.map((alert, index) => (
            <div
              key={alert.id}
              className={`grid cursor-pointer ${
                index % 2 === 0 ? 'bg-slate-950/20' : ''
              }`}
              style={{ 
                gridTemplateColumns: columnOrder.map(col => getColumnWidth(col)).join(' ')
              }}
              onClick={() => onAlertSelect(alert)}
            >
              {columnOrder.map((columnKey) => (
                <div key={columnKey} 
                  className="px-2 py-1.5 text-xs text-slate-300"
                >
                  {renderCellContent(alert, columnKey, onTimelineView)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (selectedAlert) {
    return (
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-[800px] rounded-lg border border-slate-800"
      >
        <ResizablePanel defaultSize={70} minSize={30} maxSize={85}>
          {TableContent}
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={30} minSize={15} maxSize={70}>
          <div className="h-full overflow-auto">
            <AlertDetailsView
              alert={selectedAlert}
              onClose={onClose}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  return (
    <div className="border border-slate-800 rounded-lg">
      {TableContent}
    </div>
  );
};

const getColumnLabel = (key: string): string => {
  const labels: Record<string, string> = {
    system_time: 'Time',
    user_id: 'User Origin',
    target_user_name: 'User Impacted',
    computer_name: 'Computer',
    title: 'Title',
    description: 'Description',
    ml_cluster: 'ML Cluster',
    risk: 'Risk Score'
  };
  return labels[key] || key;
};

const renderCellContent = (alert: Alert, columnKey: string, onTimelineView: (type: "user" | "computer", id: string) => void) => {
  switch (columnKey) {
    case 'system_time':
      return format(new Date(alert.system_time), "MMM dd, yyyy, HH:mm:ss");
    case 'user_id':
      return (
        <div className="flex items-center">
          <span className="truncate">
            {alert.user_id || '-'}
          </span>
        </div>
      );
    case 'target_user_name':
      return (
        <div className="flex items-center">
          <span className="truncate">
            {alert.target_user_name || '-'}
          </span>
        </div>
      );
    case 'computer_name':
      return (
        <div className="flex items-center">
          <Monitor className="h-3.5 w-3.5 text-blue-400/80 mr-1.5 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("computer", alert.computer_name || '');
            }}
          >
            {alert.computer_name || '-'}
          </span>
        </div>
      );
    case 'title':
      return (
        <div className="flex items-center">
          <FileText className="h-3.5 w-3.5 text-blue-400/80 mr-1.5 flex-shrink-0" />
          <span className="truncate">{alert.title}</span>
        </div>
      );
    case 'description':
      return (
        <div className="flex items-center">
          <AlignLeft className="h-3.5 w-3.5 text-blue-400/80 mr-1.5 flex-shrink-0" />
          <span className="truncate">{alert.description}</span>
        </div>
      );
    default:
      return String(alert[columnKey as keyof Alert] || '-');
  }
};

export default AnomaliesTableView;

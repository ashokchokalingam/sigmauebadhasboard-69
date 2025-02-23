
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Alert } from "./types";
import AlertDetailsView from "./AlertDetailsView";
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import TableHeader from "./TableComponents/TableHeader";
import TableRow from "./TableComponents/TableRow";

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

const getColumnWidth = (columnKey: string) => {
  switch (columnKey) {
    case 'system_time': return '200px';
    case 'user_id': return '160px';
    case 'target_user_name': return '160px';
    case 'title': return 'minmax(250px, 1fr)';
    case 'description': return 'minmax(350px, 1.5fr)';
    case 'computer_name': return '200px'; // Increased width
    case 'ip_address': return '200px'; // Increased width
    case 'ml_cluster': return '120px';
    case 'risk': return '140px'; // Increased for badge
    default: return '160px';
  }
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

  const TableContent = (
    <div className="h-full flex flex-col">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
          <TableHeader 
            columnOrder={columnOrder}
            getColumnWidth={getColumnWidth}
            getColumnLabel={getColumnLabel}
          />
        </SortableContext>
      </DndContext>

      <div className="flex-1 overflow-auto">
        <div className="grid">
          {filteredAlerts.map((alert, index) => (
            <TableRow
              key={alert.id}
              alert={alert}
              index={index}
              columnOrder={columnOrder}
              getColumnWidth={getColumnWidth}
              onTimelineView={onTimelineView}
              onAlertSelect={onAlertSelect}
            />
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

export default AnomaliesTableView;

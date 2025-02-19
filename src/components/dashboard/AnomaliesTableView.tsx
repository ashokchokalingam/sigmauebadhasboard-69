import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Alert } from "./types";
import AlertDetailsView from "./AlertDetailsView";
import { format } from "date-fns";
import { ChevronRight, User, Monitor, FileText, AlignLeft } from "lucide-react";

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

const AnomaliesTableView = ({
  alerts,
  selectedAlert,
  onFilterChange,
  filters,
  visibleColumns,
  onAlertSelect,
  onTimelineView,
  filteredAlerts,
  onClose
}: AnomaliesTableViewProps) => {
  const TableContent = (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-[#0A0D14] border-b border-blue-500/10">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${visibleColumns.length + 1}, minmax(100px, 1fr))` }}>
          {visibleColumns.map((columnKey) => (
            <div 
              key={columnKey}
              className="px-4 py-3 text-sm font-medium text-slate-200 hover:bg-blue-500/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <span>{getColumnLabel(columnKey)}</span>
                <input
                  type="text"
                  value={filters[columnKey] || ''}
                  onChange={(e) => onFilterChange(columnKey, e.target.value)}
                  className="ml-2 px-2 py-1 bg-[#1A1F2C] border border-blue-500/10 rounded text-xs"
                  placeholder="Filter..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          ))}
          <div className="w-[40px]" /> {/* Space for the chevron */}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`grid cursor-pointer hover:bg-blue-950/30 ${
                selectedAlert?.id === alert.id ? 'bg-blue-950/50' : ''
              }`}
              style={{ gridTemplateColumns: `repeat(${visibleColumns.length + 1}, minmax(100px, 1fr))` }}
              onClick={() => onAlertSelect(alert)}
            >
              {visibleColumns.map((columnKey) => (
                <div key={columnKey} className="px-4 py-2 text-sm text-slate-300 border-b border-blue-500/10">
                  {renderCellContent(alert, columnKey, onTimelineView)}
                </div>
              ))}
              <div className="w-[40px] flex items-center justify-center border-b border-blue-500/10">
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
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
        className="min-h-[800px] rounded-lg"
      >
        <ResizablePanel defaultSize={70} minSize={30} maxSize={85}>
          {TableContent}
        </ResizablePanel>
        
        <ResizableHandle withHandle className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors" />
        
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

  return TableContent;
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
      return format(new Date(alert.system_time), "MMM dd, yyyy, hh:mm:ss aa");
    case 'user_id':
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-400/70" />
          <span 
            className="hover:text-blue-400 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("user", alert.user_id || '');
            }}
          >
            {alert.user_id}
          </span>
        </div>
      );
    case 'computer_name':
      return (
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-blue-400/70" />
          <span 
            className="hover:text-blue-400 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("computer", alert.computer_name || '');
            }}
          >
            {alert.computer_name}
          </span>
        </div>
      );
    case 'title':
      return (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-400/70" />
          <span>{alert.title}</span>
        </div>
      );
    case 'description':
      return (
        <div className="flex items-center gap-2">
          <AlignLeft className="h-4 w-4 text-blue-400/70" />
          <span className="truncate">{alert.description}</span>
        </div>
      );
    default:
      return String(alert[columnKey as keyof Alert] || '-');
  }
};

export default AnomaliesTableView;

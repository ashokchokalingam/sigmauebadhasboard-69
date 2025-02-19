
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
        <div className="grid" style={{ 
          gridTemplateColumns: `140px ${visibleColumns.slice(1).map(col => 
            col === 'description' ? 'minmax(280px, 1fr)' :
            col === 'title' ? 'minmax(220px, 1fr)' :
            col === 'computer_name' ? 'minmax(160px, 1fr)' :
            col === 'provider_name' ? 'minmax(160px, 1fr)' :
            col === 'ip_address' ? 'minmax(130px, 1fr)' :
            'minmax(100px, 1fr)'
          ).join(' ')} 40px` 
        }}>
          {visibleColumns.map((columnKey) => (
            <div 
              key={columnKey}
              className="px-3 py-2.5 text-xs font-medium tracking-wide text-slate-400 bg-slate-950/40"
            >
              <span>{getColumnLabel(columnKey)}</span>
            </div>
          ))}
          <div className="w-[40px] bg-slate-950/40" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid">
          {filteredAlerts.map((alert, index) => (
            <div
              key={alert.id}
              className={`grid cursor-pointer transition-colors duration-150 
                ${selectedAlert?.id === alert.id ? 'bg-blue-500/10 hover:bg-blue-500/15' : 
                  index % 2 === 0 ? 'bg-slate-950/20 hover:bg-slate-900/30' : 'hover:bg-slate-900/30'}`}
              style={{ 
                gridTemplateColumns: `140px ${visibleColumns.slice(1).map(col => 
                  col === 'description' ? 'minmax(280px, 1fr)' :
                  col === 'title' ? 'minmax(220px, 1fr)' :
                  col === 'computer_name' ? 'minmax(160px, 1fr)' :
                  col === 'provider_name' ? 'minmax(160px, 1fr)' :
                  col === 'ip_address' ? 'minmax(130px, 1fr)' :
                  'minmax(100px, 1fr)'
                ).join(' ')} 40px` 
              }}
              onClick={() => onAlertSelect(alert)}
            >
              {visibleColumns.map((columnKey) => (
                <div key={columnKey} 
                  className={`px-3 py-2 text-xs border-b border-blue-500/5 
                    ${selectedAlert?.id === alert.id ? 'text-blue-100' : 'text-slate-300'}`}
                >
                  {renderCellContent(alert, columnKey, onTimelineView)}
                </div>
              ))}
              <div className="w-[40px] flex items-center justify-center border-b border-blue-500/5">
                <ChevronRight className={`h-3 w-3 ${selectedAlert?.id === alert.id ? 'text-blue-400' : 'text-slate-600'}`} />
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
        className="min-h-[800px] rounded-lg border border-blue-500/10 bg-slate-950/50"
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

  return (
    <div className="border border-blue-500/10 bg-slate-950/50 rounded-lg">
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
    risk: 'Risk Score',
    event_id: 'Event ID',
    provider_name: 'Provider',
    ip_address: 'IP Address',
    ruleid: 'Rule ID'
  };
  return labels[key] || key;
};

const renderCellContent = (alert: Alert, columnKey: string, onTimelineView: (type: "user" | "computer", id: string) => void) => {
  switch (columnKey) {
    case 'system_time':
      return (
        <div className="font-medium">
          {format(new Date(alert.system_time), "MMM dd, yyyy, HH:mm:ss")}
        </div>
      );
    case 'user_id':
      return (
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-blue-400/80 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("user", alert.user_id || '');
            }}
          >
            {alert.user_id || '-'}
          </span>
        </div>
      );
    case 'computer_name':
      return (
        <div className="flex items-center gap-1.5">
          <Monitor className="h-3.5 w-3.5 text-blue-400/80 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate font-medium"
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
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-blue-400/80 flex-shrink-0" />
          <span className="truncate">{alert.title}</span>
        </div>
      );
    case 'description':
      return (
        <div className="flex items-center gap-1.5">
          <AlignLeft className="h-3.5 w-3.5 text-blue-400/80 flex-shrink-0" />
          <span className="truncate">{alert.description}</span>
        </div>
      );
    default:
      return String(alert[columnKey as keyof Alert] || '-');
  }
};

export default AnomaliesTableView;


import { useQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useState } from "react";
import { defaultColumns } from "./TableConfig";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import TableRow from "./TableComponents/TableRow";
import TableHeader from "./TableComponents/TableHeader";
import AlertDetailsView from "./AlertDetailsView";

interface UserImpactedLogsViewProps {
  userId: string;
  onClose: () => void;
}

const getColumnWidth = (columnKey: string) => {
  switch (columnKey) {
    case 'system_time': return '200px';
    case 'user_id': return '160px';
    case 'target_user_name': return '160px';
    case 'title': return 'minmax(250px, 1fr)';
    case 'description': return 'minmax(350px, 1.5fr)';
    case 'computer_name': return '160px';
    case 'ml_cluster': return '120px';
    case 'risk': return '120px';
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

const UserImpactedLogsView = ({ userId, onClose }: UserImpactedLogsViewProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [visibleColumns] = useState<string[]>(defaultColumns.map(col => col.key));

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['userImpactedLogs', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user_impacted_logs?user_impacted=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user impacted logs');
      }
      const data = await response.json();
      return data.user_impacted_logs || [];
    },
  });

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    console.log("Timeline view requested for:", type, id);
  };

  const TableContent = (
    <div className="h-full flex flex-col">
      <TableHeader 
        columnOrder={visibleColumns}
        getColumnWidth={getColumnWidth}
        getColumnLabel={getColumnLabel}
      />
      <div className="flex-1 overflow-auto">
        <div className="grid">
          {alerts.map((alert: Alert, index: number) => (
            <TableRow
              key={alert.id || index}
              alert={alert}
              index={index}
              columnOrder={visibleColumns}
              getColumnWidth={getColumnWidth}
              onTimelineView={handleTimelineView}
              onAlertSelect={setSelectedAlert}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="h-full bg-[#1A1F2C] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          User Impact Logs: {userId}
        </h2>
        <button 
          onClick={onClose}
          className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>

      {selectedAlert ? (
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
                onClose={() => setSelectedAlert(null)}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="border border-slate-800 rounded-lg">
          {TableContent}
        </div>
      )}
    </div>
  );
};

export default UserImpactedLogsView;

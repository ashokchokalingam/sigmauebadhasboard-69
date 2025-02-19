
import { useInfiniteQuery } from "@tanstack/react-query";
import { Alert } from "./types";
import { useInView } from "react-intersection-observer";
import TimelineSummaryStats from "./TimelineComponents/TimelineSummaryStats";
import TimelineHeader from "../timeline/TimelineHeader";
import { formatTimelineData, getTimelineEndpoint } from "@/utils/timelineHelpers";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import AlertDetailsView from "./AlertDetailsView";
import { useState } from "react";
import { defaultColumns } from "./TableConfig";
import TableCell from "./TableComponents/TableCell";

interface TimelineViewProps {
  entityType: "userorigin" | "userimpacted" | "computersimpacted";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const { ref, inView } = useInView();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [visibleColumns] = useState<string[]>(
    defaultColumns.map((col) => col.key)
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["timeline", entityType, entityId],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = getTimelineEndpoint(entityType);
      const queryParam = `${entityType.includes('user') ? 
        (entityType === 'userorigin' ? 'user_origin' : 'user_impacted') : 
        'computer_name'}=${entityId}`;
      
      const response = await fetch(`${endpoint}?${queryParam}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }

      const data = await response.json();
      return formatTimelineData(data);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_more) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    enabled: Boolean(entityType && entityId),
  });

  const allEvents = data?.pages.flatMap(
    (page) => entityType === "computersimpacted" ? page.computer_impacted_timeline : 
              entityType === "userorigin" ? page.user_origin_timeline :
              page.user_impacted_timeline
  ) || [];

  if (inView && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    // Handle nested timeline view if needed
    console.log("Timeline view requested for:", type, id);
  };

  const TimelineContent = (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-50 bg-[#0A0D14] border-b border-slate-800">
        <div className="grid" style={{ 
          gridTemplateColumns: visibleColumns.map(col => {
            switch (col) {
              case 'system_time': return '200px';
              case 'title': return 'minmax(250px, 1fr)';
              case 'description': return 'minmax(350px, 1.5fr)';
              default: return '160px';
            }
          }).join(' ')
        }}>
          {visibleColumns.map((columnKey) => (
            <div key={columnKey} className="px-3 py-3 text-sm font-medium text-slate-300">
              {columnKey}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid">
          {allEvents.map((alert, index) => (
            <div
              key={`${alert.id}-${index}`}
              className={`grid cursor-pointer ${
                index % 2 === 0 ? 'bg-slate-950/20' : ''
              } hover:bg-slate-800/20`}
              style={{ 
                gridTemplateColumns: visibleColumns.map(col => {
                  switch (col) {
                    case 'system_time': return '200px';
                    case 'title': return 'minmax(250px, 1fr)';
                    case 'description': return 'minmax(350px, 1.5fr)';
                    default: return '160px';
                  }
                }).join(' ')
              }}
              onClick={() => setSelectedAlert(alert)}
            >
              {visibleColumns.map((columnKey) => (
                <div key={columnKey} className="px-3 py-2.5 text-sm text-slate-300">
                  <TableCell 
                    alert={alert}
                    columnKey={columnKey}
                    onTimelineView={handleTimelineView}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#1A1F2C]">
      <TimelineHeader entityId={entityId} onClose={onClose} />

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col space-y-4 p-6">
          <div className="flex-none">
            <TimelineSummaryStats alerts={allEvents} />
          </div>

          <div className="flex-1 min-h-0">
            {selectedAlert ? (
              <ResizablePanelGroup 
                direction="horizontal" 
                className="min-h-[800px] rounded-lg border border-slate-800"
              >
                <ResizablePanel defaultSize={70} minSize={30} maxSize={85}>
                  {TimelineContent}
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
              <div className="bg-black/40 rounded-xl border border-blue-500/10 h-full">
                {TimelineContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;

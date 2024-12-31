import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import AlertDetailsView from "./AlertDetailsView";
import TimelineView from "./TimelineView";
import { useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface DetailsSidebarProps {
  selectedAlert: Alert | null;
  timelineView: { type: "user" | "computer"; id: string } | null;
  alerts: Alert[];
  onTimelineClose: () => void;
}

const DetailsSidebar = ({ 
  selectedAlert, 
  timelineView, 
  alerts,
  onTimelineClose 
}: DetailsSidebarProps) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onTimelineClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onTimelineClose]);

  if (!selectedAlert && !timelineView) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-[90vh] w-[90vw] max-w-[1400px] min-w-[600px] rounded-lg bg-background"
        >
          <ResizablePanel defaultSize={100} minSize={30}>
            <div className="h-full overflow-y-auto scrollbar-thin">
              {selectedAlert && (
                <Card className="h-full border-none rounded-none">
                  <CardContent className="p-6">
                    <AlertDetailsView alert={selectedAlert} />
                  </CardContent>
                </Card>
              )}
              {timelineView && (
                <Card className="h-full border-none rounded-none">
                  <CardContent className="p-6">
                    <TimelineView
                      alerts={alerts}
                      entityType={timelineView.type}
                      entityId={timelineView.id}
                      onClose={onTimelineClose}
                      inSidebar={true}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DetailsSidebar;
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import AlertDetailsView from "./AlertDetailsView";
import TimelineView from "./TimelineView";
import { useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import MetadataPanel from "./MetadataPanel";

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 flex items-start justify-center p-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[95vh] w-[95vw] max-w-[1800px] rounded-lg bg-background"
        >
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-[95vh] overflow-y-auto scrollbar-thin">
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
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-[95vh] overflow-y-auto scrollbar-thin p-6">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              <MetadataPanel selectedAlert={selectedAlert} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DetailsSidebar;
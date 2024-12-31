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
  // Handle ESC key press to close the entire sidebar
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
    <ResizablePanelGroup
      direction="horizontal"
      className={`fixed top-0 right-0 h-screen min-w-[600px] max-w-[1400px] bg-black/90 transform transition-all duration-300 ease-in-out z-50 ${
        selectedAlert || timelineView ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <ResizableHandle withHandle className="bg-blue-500/20 hover:bg-blue-500/30 transition-colors" />
      <ResizablePanel defaultSize={80} minSize={30} className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
        {selectedAlert && (
          <Card className="min-h-screen bg-transparent border-none">
            <CardContent className="p-6">
              <AlertDetailsView alert={selectedAlert} />
            </CardContent>
          </Card>
        )}
        {timelineView && (
          <Card className="min-h-screen bg-transparent border-none">
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
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DetailsSidebar;
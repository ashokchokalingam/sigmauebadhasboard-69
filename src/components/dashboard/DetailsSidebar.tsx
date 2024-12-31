import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import AlertDetailsView from "./AlertDetailsView";
import TimelineView from "./TimelineView";
import { useEffect } from "react";

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

  return (
    <div className={`fixed top-0 right-0 h-screen w-[800px] bg-black/90 transform transition-all duration-300 ease-in-out overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent z-50 ${
      selectedAlert || timelineView ? 'translate-x-0' : 'translate-x-full'
    }`}>
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
    </div>
  );
};

export default DetailsSidebar;
import { Alert } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, User, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import TimelineEventCard from "./TimelineEventCard";

interface TimelineViewProps {
  alerts: Alert[];
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
}

const TimelineView = ({ alerts, entityType, entityId, onClose }: TimelineViewProps) => {
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Filter and sort alerts for the specific entity
  const filteredAlerts = alerts
    .filter(alert => 
      entityType === "user" 
        ? alert.user_id === entityId
        : alert.computer_name === entityId
    )
    .sort((a, b) => new Date(b.system_time).getTime() - new Date(a.system_time).getTime());

  const toggleRawLog = (alertId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timelineRef.current && !timelineRef.current.contains(event.target as Node)) {
        // Check if the click is on a scrollbar
        const clickX = event.clientX;
        const clickY = event.clientY;
        const html = document.documentElement;
        const vScrollbar = html.scrollHeight > html.clientHeight;
        const hScrollbar = html.scrollWidth > html.clientWidth;
        
        // Get scrollbar dimensions
        const scrollbarWidth = window.innerWidth - html.clientWidth;
        const scrollbarHeight = window.innerHeight - html.clientHeight;
        
        // Check if click is on vertical scrollbar
        const isVerticalScrollbarClick = vScrollbar && 
          clickX >= window.innerWidth - scrollbarWidth;
        
        // Check if click is on horizontal scrollbar
        const isHorizontalScrollbarClick = hScrollbar && 
          clickY >= window.innerHeight - scrollbarHeight;
        
        // Only close if not clicking scrollbars
        if (!isVerticalScrollbarClick && !isHorizontalScrollbarClick) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={timelineRef} className="flex gap-4">
      <Card className="bg-black/40 border-blue-500/10 w-[800px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-blue-100 flex items-center gap-2">
            {entityType === "user" ? (
              <User className="h-5 w-5 text-blue-500" />
            ) : (
              <Monitor className="h-5 w-5 text-blue-500" />
            )}
            {entityId} Timeline
          </CardTitle>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-blue-400" />
          </button>
        </CardHeader>
        <CardContent className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-blue-500/20" />
          
          <div className="space-y-8">
            {filteredAlerts.map((alert, index) => (
              <TimelineEventCard
                key={alert.id}
                alert={alert}
                isExpanded={expandedAlert === alert.id}
                onToggleRaw={toggleRawLog}
                isFirst={index === 0}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineView;
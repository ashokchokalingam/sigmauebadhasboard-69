import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZoomIn, ZoomOut } from "lucide-react";
import { TimeInterval } from "./timelineUtils";

interface TimelineControlsProps {
  interval: TimeInterval;
  onIntervalChange: (interval: TimeInterval) => void;
  viewMode: 'count' | 'severity';
  onViewModeChange: (mode: 'count' | 'severity') => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
}

const TimelineControls = ({
  interval,
  onIntervalChange,
  viewMode,
  onViewModeChange,
  zoomLevel,
  onZoomChange,
}: TimelineControlsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Select value={interval} onValueChange={(value) => onIntervalChange(value as TimeInterval)}>
          <SelectTrigger className="w-[180px] bg-black/20">
            <SelectValue placeholder="Select interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5m">5 Minutes</SelectItem>
            <SelectItem value="15m">15 Minutes</SelectItem>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="6h">6 Hours</SelectItem>
            <SelectItem value="1d">1 Day</SelectItem>
          </SelectContent>
        </Select>

        <Select value={viewMode} onValueChange={(value) => onViewModeChange(value as 'count' | 'severity')}>
          <SelectTrigger className="w-[180px] bg-black/20">
            <SelectValue placeholder="Select view mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Event Count</SelectItem>
            <SelectItem value="severity">By Severity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onZoomChange(Math.max(1, zoomLevel - 1))}
          className="bg-black/20"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onZoomChange(Math.min(5, zoomLevel + 1))}
          className="bg-black/20"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimelineControls;
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZoomIn, ZoomOut } from 'lucide-react';

interface TimelineControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  selectedSeverity: string | null;
  onSeveritySelect: (severity: string | null) => void;
  severities: string[];
  timeGranularity: '5min' | 'hour' | 'day';
  onGranularityChange: (granularity: '5min' | 'hour' | 'day') => void;
}

const TimelineControls = ({
  onZoomIn,
  onZoomOut,
  timeGranularity,
  onGranularityChange
}: TimelineControlsProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Select
        value={timeGranularity}
        onValueChange={(value: '5min' | 'hour' | 'day') => onGranularityChange(value)}
      >
        <SelectTrigger className="w-[140px] h-8 text-xs bg-black/40 border-blue-500/20">
          <SelectValue placeholder="Time format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5min">1 hour per column</SelectItem>
          <SelectItem value="hour">1 day per column</SelectItem>
          <SelectItem value="day">1 week per column</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          className="h-8 px-2 text-xs bg-black/40 border-blue-500/20 hover:bg-blue-500/10"
        >
          <ZoomOut className="h-3 w-3 mr-1" /> Zoom Out
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          className="h-8 px-2 text-xs bg-black/40 border-blue-500/20 hover:bg-blue-500/10"
        >
          <ZoomIn className="h-3 w-3 mr-1" /> Zoom to Selection
        </Button>
      </div>
    </div>
  );
};

export default TimelineControls;
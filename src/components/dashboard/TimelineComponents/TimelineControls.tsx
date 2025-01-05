import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, Filter } from 'lucide-react';
import { getSeverityColor } from '../utils/timelineDataUtils';

interface TimelineControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  selectedSeverity: string | null;
  onSeveritySelect: (severity: string | null) => void;
  severities: string[];
}

const TimelineControls = ({
  onZoomIn,
  onZoomOut,
  selectedSeverity,
  onSeveritySelect,
  severities
}: TimelineControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          className="bg-blue-500/10 hover:bg-blue-500/20"
        >
          <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          className="bg-blue-500/10 hover:bg-blue-500/20"
        >
          <ZoomOut className="h-4 w-4 mr-1" /> Reset
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-blue-400" />
        <div className="flex gap-1">
          {severities.map((severity) => (
            <Badge
              key={severity}
              variant="outline"
              className={`cursor-pointer transition-all ${
                selectedSeverity === severity ? 'bg-blue-500/20' : ''
              }`}
              style={{
                borderColor: getSeverityColor(severity),
                color: getSeverityColor(severity),
              }}
              onClick={() => onSeveritySelect(
                selectedSeverity === severity ? null : severity
              )}
            >
              {severity}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineControls;
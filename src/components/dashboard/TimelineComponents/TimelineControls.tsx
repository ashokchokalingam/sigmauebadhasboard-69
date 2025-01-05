import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZoomIn, ZoomOut, Filter } from 'lucide-react';
import { getSeverityColor } from '../utils/timelineDataUtils';

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
  selectedSeverity,
  onSeveritySelect,
  severities,
  timeGranularity,
  onGranularityChange
}: TimelineControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-6 bg-[#0D1117] p-4 rounded-lg border border-blue-500/5">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          className="bg-transparent border-blue-500/20 hover:bg-blue-500/10 text-blue-400"
        >
          <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          className="bg-transparent border-blue-500/20 hover:bg-blue-500/10 text-blue-400"
        >
          <ZoomOut className="h-4 w-4 mr-1" /> Reset
        </Button>
        
        <Select
          value={timeGranularity}
          onValueChange={(value: '5min' | 'hour' | 'day') => onGranularityChange(value)}
        >
          <SelectTrigger className="w-[180px] bg-transparent border-blue-500/20 text-blue-400">
            <SelectValue placeholder="Select granularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5min">5 Minutes</SelectItem>
            <SelectItem value="hour">Hourly</SelectItem>
            <SelectItem value="day">Daily</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-blue-400" />
        <div className="flex gap-2">
          {severities.map((severity) => (
            <Badge
              key={severity}
              variant="outline"
              className={`cursor-pointer transition-all hover:bg-blue-500/10 ${
                selectedSeverity === severity ? 'bg-blue-500/20' : 'bg-transparent'
              } border-blue-500/20`}
              style={{
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
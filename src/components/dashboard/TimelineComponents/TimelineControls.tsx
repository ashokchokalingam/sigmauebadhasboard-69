import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimelineControlsProps {
  timeRange: '1h' | '24h' | '7d';
  onTimeRangeChange: (range: '1h' | '24h' | '7d') => void;
  selectedSeverity: string | null;
  onSeveritySelect: (severity: string | null) => void;
}

const TimelineControls = ({
  timeRange,
  onTimeRangeChange,
  selectedSeverity,
  onSeveritySelect,
}: TimelineControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {['1h', '24h', '7d'].map((range) => (
          <Badge
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            className={`cursor-pointer ${
              timeRange === range 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'hover:bg-blue-500/10'
            }`}
            onClick={() => onTimeRangeChange(range as '1h' | '24h' | '7d')}
          >
            {range}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {['Critical', 'High', 'Medium'].map((severity) => (
          <Button
            key={severity}
            variant="outline"
            size="sm"
            className={`h-8 px-2 text-xs ${
              selectedSeverity === severity
                ? 'bg-blue-500/20 border-blue-500'
                : 'bg-black/40 border-blue-500/20 hover:bg-blue-500/10'
            }`}
            onClick={() => onSeveritySelect(selectedSeverity === severity ? null : severity)}
          >
            {severity}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimelineControls;
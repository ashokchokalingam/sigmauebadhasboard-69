import { Loader2 } from "lucide-react";

interface TimelineLoadingIndicatorProps {
  isVisible: boolean;
}

const TimelineLoadingIndicator = ({ isVisible }: TimelineLoadingIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-blue-400 animate-fade-in">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Updating Event Timeline...</span>
    </div>
  );
};

export default TimelineLoadingIndicator;
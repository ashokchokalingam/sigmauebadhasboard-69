import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TimelineControls = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-blue-500/10">
          Filter
        </Badge>
      </div>
    </div>
  );
};

export default TimelineControls;
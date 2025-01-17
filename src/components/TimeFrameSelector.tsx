import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimeFrameSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TimeFrameSelector = ({ value, onValueChange }: TimeFrameSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <Clock className="h-5 w-5 text-blue-400" />
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px] bg-black/20 border-blue-500/20 hover:border-blue-500/40 transition-colors">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent className="bg-[#1A1F2C] border border-blue-500/20">
          <SelectItem value="1d">Last 24 Hours</SelectItem>
          <SelectItem value="2d">Last 2 Days</SelectItem>
          <SelectItem value="3d">Last 3 Days</SelectItem>
          <SelectItem value="4d">Last 4 Days</SelectItem>
          <SelectItem value="5d">Last 5 Days</SelectItem>
          <SelectItem value="6d">Last 6 Days</SelectItem>
          <SelectItem value="7d">Last 7 Days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeFrameSelector;
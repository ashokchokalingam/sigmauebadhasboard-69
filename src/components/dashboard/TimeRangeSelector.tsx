import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeRangeSelector = ({ value, onChange }: TimeRangeSelectorProps) => {
  return (
    <div className="flex items-center gap-2 bg-[#1A1F2C]/30 rounded-lg px-4 py-2 border border-blue-500/10 backdrop-blur-sm">
      <Clock className="h-4 w-4 text-blue-400" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-blue-100">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1h">Last Hour</SelectItem>
          <SelectItem value="24h">Last 24 Hours</SelectItem>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeRangeSelector;
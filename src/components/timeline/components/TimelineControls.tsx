
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption, FilterOption } from "../hooks/useProcessedEvents";

interface TimelineControlsProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (value: SortOption) => void;
  onFilterChange: (value: FilterOption) => void;
}

const TimelineControls = ({ 
  sortBy, 
  filterBy, 
  onSortChange, 
  onFilterChange 
}: TimelineControlsProps) => {
  return (
    <div className="p-3 border-b border-blue-500/10 flex gap-3 items-center">
      <Select
        value={sortBy}
        onValueChange={(value) => onSortChange(value as SortOption)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="severity">By Severity</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filterBy}
        onValueChange={(value) => onFilterChange(value as FilterOption)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="critical">Critical/High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low/Info</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimelineControls;

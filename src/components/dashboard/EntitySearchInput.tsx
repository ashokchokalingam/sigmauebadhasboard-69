import { Search, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EntitySearchInputProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const EntitySearchInput = ({ searchQuery, onSearchChange }: EntitySearchInputProps) => {
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search entities..."
          className="w-full pl-10 pr-4 py-3 
            bg-dashboard-section-1/60
            border border-gray-500/20 hover:border-gray-500/40
            rounded-lg text-sm text-gray-300 
            placeholder:text-gray-400/50
            focus:outline-none focus:ring-1 focus:ring-gray-500/40
            transition-all duration-200"
        />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Search for specific entities by name or ID</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EntitySearchInput;
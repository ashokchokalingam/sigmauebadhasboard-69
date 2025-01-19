import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ColumnFilterProps {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

const ColumnFilter = ({ title, options, onSelect, selectedValue }: ColumnFilterProps) => {
  const uniqueOptions = Array.from(new Set(options)).filter(Boolean);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-400 transition-colors">
        <span className={selectedValue ? "text-blue-400" : ""}>{title}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-slate-900 border border-blue-500/20 w-[300px]"
        align="start"
      >
        <ScrollArea className="h-[300px]">
          <DropdownMenuItem 
            className="text-blue-300 hover:text-blue-400 hover:bg-blue-950/50 cursor-pointer"
            onClick={() => onSelect('')}
          >
            All
          </DropdownMenuItem>
          {uniqueOptions.map((option, index) => (
            <DropdownMenuItem
              key={`${option}-${index}`}
              className={`${
                selectedValue === option ? 'bg-blue-950/50 text-blue-400' : 'text-blue-300'
              } hover:text-blue-400 hover:bg-blue-950/50 cursor-pointer truncate`}
              onClick={() => onSelect(option)}
            >
              {option || 'N/A'}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnFilter;
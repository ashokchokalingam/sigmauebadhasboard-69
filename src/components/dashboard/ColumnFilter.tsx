import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface ColumnFilterProps {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

const ColumnFilter = ({ title, options, onSelect, selectedValue }: ColumnFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const processOptions = (opts: string[]) => {
    const processed = opts.map(opt => {
      if (opt === null || opt === undefined || opt === '') return '—';
      return opt.toString().trim();
    });
    
    const uniqueOpts = Array.from(new Set(processed)).sort((a, b) => {
      if (a === '—') return 1;
      if (b === '—') return -1;
      return a.localeCompare(b);
    });
    
    return uniqueOpts;
  };

  const uniqueOptions = processOptions(options);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-400 transition-colors">
        <span className={selectedValue ? "text-blue-400" : ""}>{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-slate-900 border border-blue-500/20 w-[300px] animate-in fade-in-0 zoom-in-95"
        align="start"
        sideOffset={8}
      >
        <ScrollArea className="h-[300px] overflow-y-auto">
          <DropdownMenuItem 
            className="text-blue-300 hover:text-blue-400 hover:bg-blue-950/50 cursor-pointer"
            onClick={() => {
              onSelect('');
              setIsOpen(false);
            }}
          >
            All
          </DropdownMenuItem>
          {uniqueOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              className={`${
                selectedValue === option ? 'bg-blue-950/50 text-blue-400' : 'text-blue-300'
              } hover:text-blue-400 hover:bg-blue-950/50 cursor-pointer truncate transition-colors duration-200`}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnFilter;
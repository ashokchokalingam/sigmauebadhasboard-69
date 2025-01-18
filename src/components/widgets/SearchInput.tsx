import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400/50" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search critical users..."}
        className="w-full pl-10 pr-4 py-2.5 bg-[#0D0E12] rounded-lg
          border border-red-500/10 hover:border-red-500/20 
          text-sm text-red-100/90 placeholder:text-red-400/30
          transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-red-500/20"
      />
    </div>
  );
};

export default SearchInput;
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400/50" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search critical users..."}
        className="w-full pl-11 pr-4 py-3 bg-[#0D0E12] rounded-xl
          border border-indigo-500/10 hover:border-indigo-500/20 
          text-sm text-indigo-100/90 placeholder:text-indigo-400/30
          transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/20
          shadow-inner shadow-indigo-500/5"
      />
    </div>
  );
};

export default SearchInput;